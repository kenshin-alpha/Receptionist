import { ClinicHours } from './clinic-hours.entity';
import { Practitioner } from './practitioner.entity';
import { Service } from './service.entity';
import { Patient } from './patient.entity';
export declare class Clinic {
    id: string;
    name: string;
    timezone: string;
    depositCents: number;
    createdAt: Date;
    hours: ClinicHours[];
    practitioners: Practitioner[];
    services: Service[];
    patients: Patient[];
}
