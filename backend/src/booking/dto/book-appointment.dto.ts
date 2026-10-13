import { IsDateString, IsUUID } from 'class-validator';

export class BookAppointmentDto {
    @IsUUID()
    clinicId: string;

    @IsUUID()
    practitionerId: string;

    @IsUUID()
    serviceId: string;

    @IsUUID()
    patientId: string;  

    @IsDateString()
    startsAt: string;
}