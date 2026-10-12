import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { ClinicHours } from '../entities/clinic-hours.entity';
import { Practitioner } from '../entities/practitioner.entity';
import { Service } from '../entities/service.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    this.logger.log('Seeding database...');

    await this.wipe();
    const clinic = await this.insertClinic();
    await this.insertHours(clinic);
    const practitioner = await this.insertPractitioner(clinic);
    const services = await this.insertServices(clinic);
    const patients = await this.insertPatients(clinic);
    await this.insertAppointments(clinic, practitioner, services, patients);

    this.logger.log('Seed complete.');
  }

  // Delete everything in dependency order.
  private async wipe() {
    const em = this.dataSource.manager;
    await em.query('TRUNCATE appointments, patients, services, clinic_hours, practitioners, clinics CASCADE;');
  }

  private async insertClinic() {
    const repo = this.dataSource.getRepository(Clinic);
    const clinic = repo.create({
      name: 'Grafton Dental',
      timezone: 'Europe/Dublin',
      depositCents: 2000, // €20
    });
    return repo.save(clinic);
  }

  private async insertHours(clinic: Clinic) {
    const repo = this.dataSource.getRepository(ClinicHours);
    // Mon-Fri 9:00-13:00 and 14:00-17:30, closed weekends.
    const weekdays = [0, 1, 2, 3, 4]; // 0 = Mon .. 6 = Sun
    const rows: Partial<ClinicHours>[] = [];
    for (const d of weekdays) {
      rows.push({ clinic, dayOfWeek: d, opensAt: '09:00', closesAt: '13:00' });
      rows.push({ clinic, dayOfWeek: d, opensAt: '14:00', closesAt: '17:30' });
    }
    await repo.save(rows);
  }

  private async insertPractitioner(clinic: Clinic) {
    const repo = this.dataSource.getRepository(Practitioner);
    return repo.save(repo.create({ clinic, name: 'Dr Ní Bhriain' }));
  }

  private async insertServices(clinic: Clinic) {
    const repo = this.dataSource.getRepository(Service);
    return repo.save([
      repo.create({ clinic, name: 'Check-up',  durationMinutes: 30, priceCents: 5000  }),
      repo.create({ clinic, name: 'Cleaning',  durationMinutes: 45, priceCents: 8000  }),
      repo.create({ clinic, name: 'Filling',   durationMinutes: 60, priceCents: 15000 }),
    ]);
  }

  private async insertPatients(clinic: Clinic) {
    const repo = this.dataSource.getRepository(Patient);
    return repo.save([
      repo.create({ clinic, name: 'Aisling O\'Brien',  phone: '+353871111111', email: 'aisling@example.com' }),
      repo.create({ clinic, name: 'Conor Murphy',     phone: '+353872222222', email: null }),
      repo.create({ clinic, name: 'Niamh Byrne',      phone: '+353873333333', email: 'niamh@example.com' }),
      repo.create({ clinic, name: 'Darragh Kelly',    phone: '+353874444444', email: null }),
      repo.create({ clinic, name: 'Saoirse Kavanagh', phone: '+353875555555', email: 'saoirse@example.com' }),
    ]);
  }

  private async insertAppointments(
    clinic: Clinic,
    practitioner: Practitioner,
    services: Service[],
    patients: Patient[],
  ) {
    const repo = this.dataSource.getRepository(Appointment);

    // Scatter three appointments over the next two weeks, in UTC.
    // Dates are expressed in UTC. Europe/Dublin in October is UTC+1.
    const now = new Date();
    const base = new Date(now);
    base.setUTCHours(9, 0, 0, 0); // 09:00 UTC == 10:00 Dublin
    base.setUTCDate(base.getUTCDate() + 1); // tomorrow

    const makeAppt = (
      offsetDays: number,
      hour: number,
      minute: number,
      service: Service,
      patient: Patient,
    ) => {
      const start = new Date(base);
      start.setUTCDate(base.getUTCDate() + offsetDays);
      start.setUTCHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + service.durationMinutes * 60_000);
      return repo.create({
        clinic,
        practitioner,
        patient,
        service,
        startsAt: start,
        endsAt: end,
      });
    };

    await repo.save([
      makeAppt(0, 9,  0,  services[0], patients[0]), // tomorrow 09:00 UTC, 30-min Check-up
      makeAppt(2, 13, 0,  services[1], patients[1]), // +3 days 13:00 UTC, 45-min Cleaning
      makeAppt(7, 14, 30, services[2], patients[2]), // +8 days 14:30 UTC, 60-min Filling
    ]);
  }
}