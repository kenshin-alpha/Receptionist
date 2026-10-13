import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { Practitioner } from './practitioner.entity';
import { Patient } from './patient.entity';
import { Service } from './service.entity';

export type AppointmentStatus = 'booked' | 'completed' | 'cancelled' | 'no_show';

export type DepositStatus = 'none' | 'required' | 'paid';

@Entity({ name: 'appointments' })
@Index(['practitioner', 'startsAt'])

export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Clinic, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @ManyToOne(() => Practitioner, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'practitioner_id' })
    practitioner: Practitioner;

    @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @ManyToOne(() => Service, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ type: 'timestamptz', name: 'starts_at' })
    startsAt: Date;

    @Column({ type: 'timestamptz', name: 'ends_at' })
    endsAt: Date;

    @Column({ type: 'text', default: 'booked' })
    status: AppointmentStatus;

    @Column({ type: 'text', name: 'deposit_status', default: 'none' })
    depositStatus: DepositStatus;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}