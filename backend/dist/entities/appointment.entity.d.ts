import { Clinic } from './clinic.entity';
import { Practitioner } from './practitioner.entity';
import { Patient } from './patient.entity';
import { Service } from './service.entity';
export type AppointmentStatus = 'booked' | 'completed' | 'cancelled' | 'no_show';
export type DepositStatus = 'none' | 'required' | 'paid';
export declare class Appointment {
    id: string;
    clinic: Clinic;
    practitioner: Practitioner;
    patient: Patient;
    service: Service;
    startsAt: Date;
    endsAt: Date;
    status: AppointmentStatus;
    depositStatus: DepositStatus;
    createdAt: Date;
}
