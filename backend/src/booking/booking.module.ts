import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import { Clinic } from '../entities/clinic.entity';
import { ClinicHours } from '../entities/clinic-hours.entity';
import { Service } from '../entities/service.entity';
import {Appointment} from '../entities/appointment.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Clinic, ClinicHours, Service, Appointment]),
    ],
    controllers: [BookingController],
    providers: [BookingService],
    exports: [BookingService],
})
export class BookingModule {}
