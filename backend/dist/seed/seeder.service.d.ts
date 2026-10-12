import { DataSource } from 'typeorm';
export declare class SeederService {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    seed(): Promise<void>;
    private wipe;
    private insertClinic;
    private insertHours;
    private insertPractitioner;
    private insertServices;
    private insertPatients;
    private insertAppointments;
}
