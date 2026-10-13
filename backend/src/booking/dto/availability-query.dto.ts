import { IsDateString, IsUUID } from 'class-validator';

export class AvailabilityQueryDto {
    @IsUUID()
    clinicId: string;

    @IsUUID()
    practitionerId: string;

    @IsUUID()
    serviceId: string;

    @IsDateString()
    from: string;

    @IsDateString()
    to: string;
}