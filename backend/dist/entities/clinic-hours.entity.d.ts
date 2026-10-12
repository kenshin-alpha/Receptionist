import { Clinic } from './clinic.entity';
export declare class ClinicHours {
    id: string;
    clinic: Clinic;
    dayOfWeek: number;
    opensAt: string;
    closesAt: string;
}
