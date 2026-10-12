import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Clinic } from './entities/clinic.entity';
import { ClinicHours } from './entities/clinic-hours.entity';
import { Practitioner } from './entities/practitioner.entity';
import { Service } from './entities/service.entity';
import { Patient } from './entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { DbBootstrapService } from './db/db-bootstrap.service';
import { SeederService } from './seed/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Clinic, ClinicHours, Practitioner, Service, Patient, Appointment],
        synchronize: true,
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService, DbBootstrapService, SeederService],
})
export class AppModule {}
