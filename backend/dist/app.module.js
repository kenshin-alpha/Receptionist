"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const clinic_entity_1 = require("./entities/clinic.entity");
const clinic_hours_entity_1 = require("./entities/clinic-hours.entity");
const practitioner_entity_1 = require("./entities/practitioner.entity");
const service_entity_1 = require("./entities/service.entity");
const patient_entity_1 = require("./entities/patient.entity");
const appointment_entity_1 = require("./entities/appointment.entity");
const db_bootstrap_service_1 = require("./db/db-bootstrap.service");
const seeder_service_1 = require("./seed/seeder.service");
const booking_module_1 = require("./booking/booking.module");
const agent_module_1 = require("./agent/agent.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [clinic_entity_1.Clinic, clinic_hours_entity_1.ClinicHours, practitioner_entity_1.Practitioner, service_entity_1.Service, patient_entity_1.Patient, appointment_entity_1.Appointment],
                    synchronize: true,
                }),
            }),
            booking_module_1.BookingModule,
            agent_module_1.AgentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, db_bootstrap_service_1.DbBootstrapService, seeder_service_1.SeederService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map