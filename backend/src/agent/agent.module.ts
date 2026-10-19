import { Module }   from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../booking/booking.module';
import { Clinic } from '../entities/clinic.entity';
import { Practitioner } from '../entities/practitioner.entity';
import { Patient } from '../entities/patient.entity';
import { Service } from '../entities/service.entity';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';

@Module({
    imports: [
        BookingModule,
        TypeOrmModule.forFeature([Clinic, Practitioner, Patient, Service]),
    ],
    providers: [AgentService],
    controllers: [AgentController],
})

export class AgentModule{}