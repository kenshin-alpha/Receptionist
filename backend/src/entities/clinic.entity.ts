import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ClinicHours } from './clinic-hours.entity';
import { Practitioner } from './practitioner.entity';
import { Service } from './service.entity';
import { Patient } from './patient.entity';

@Entity({ name: 'clinics' })
export class Clinic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text'})
    name: string;

    @Column({ type: 'text' })
    timezone: string;

    @Column({ type: 'int', name: 'deposit_cents', default: 0 })
    depositCents: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @OneToMany(() => ClinicHours, (hours) => hours.clinic)
    hours: ClinicHours[];

    @OneToMany(() => Practitioner, (p) => p.clinic)
    practitioners: Practitioner[];

    @OneToMany(() => Service, (s) => s.clinic)
    services: Service[];

    @OneToMany(() => Patient, (p) => p.clinic)
    patients: Patient[];
}
