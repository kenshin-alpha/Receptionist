import { Clinic } from './clinic.entity';
export declare class Patient {
    id: string;
    clinic: Clinic;
    name: string;
    phone: string;
    email: string | null;
    createdAt: Date;
}
