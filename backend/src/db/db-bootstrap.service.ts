import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DbBootstrapService.name);

    constructor(private readonly dataSource: DataSource) {}

    async onApplicationBootstrap() {

        await this.dataSource.query(` CREATE EXTENSION IF NOT EXISTS btree_gist; `);

        const [existing] = await this.dataSource.query(`SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_appointments';`);

        if (!existing) {
            await this.dataSource.query(`
                ALTER TABLE appointments
                ADD CONSTRAINT no_overlapping_appointments EXCLUDE USING gist (
                    practitioner_id WITH =,
                    tstzrange(starts_at, ends_at, '[)') WITH &&
                ) WHERE (status = 'booked');
            `);
            this.logger.log('Added exclusion constraint no_overlapping_appointments');
        } else {
            this.logger.log('Exclusion constraint already present');
        }
    }
}
