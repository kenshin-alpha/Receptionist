import { Repository } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { ClinicHours } from '../entities/clinic-hours.entity';
import { Service } from '../entities/service.entity';
import { Appointment } from '../entities/appointment.entity';
export interface AvailabilityQuery {
    clinicId: string;
    practitionerId: string;
    serviceId: string;
    fromUtc: Date;
    toUtc: Date;
    stepMinutes?: number;
}
export interface Slot {
    startsAt: Date;
    endsAt: Date;
}
export declare class BookingService {
    private readonly clinics;
    private readonly hours;
    private readonly services;
    private readonly appointments;
    constructor(clinics: Repository<Clinic>, hours: Repository<ClinicHours>, services: Repository<Service>, appointments: Repository<Appointment>);
    getAvailableSlots(q: AvailabilityQuery): Promise<Slot[]>;
}
