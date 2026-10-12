import { Clinic } from './clinic.entity';
export declare class Service {
    id: string;
    clinic: Clinic;
    name: string;
    durationMinutes: number;
    priceCents: number;
    createdAt: Date;
}
