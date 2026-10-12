"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const clinic_entity_1 = require("../entities/clinic.entity");
const clinic_hours_entity_1 = require("../entities/clinic-hours.entity");
const practitioner_entity_1 = require("../entities/practitioner.entity");
const service_entity_1 = require("../entities/service.entity");
const patient_entity_1 = require("../entities/patient.entity");
const appointment_entity_1 = require("../entities/appointment.entity");
let SeederService = SeederService_1 = class SeederService {
    dataSource;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async seed() {
        this.logger.log('Seeding database...');
        await this.wipe();
        const clinic = await this.insertClinic();
        await this.insertHours(clinic);
        const practitioner = await this.insertPractitioner(clinic);
        const services = await this.insertServices(clinic);
        const patients = await this.insertPatients(clinic);
        await this.insertAppointments(clinic, practitioner, services, patients);
        this.logger.log('Seed complete.');
    }
    async wipe() {
        const em = this.dataSource.manager;
        await em.query('TRUNCATE appointments, patients, services, clinic_hours, practitioners, clinics CASCADE;');
    }
    async insertClinic() {
        const repo = this.dataSource.getRepository(clinic_entity_1.Clinic);
        const clinic = repo.create({
            name: 'Grafton Dental',
            timezone: 'Europe/Dublin',
            depositCents: 2000,
        });
        return repo.save(clinic);
    }
    async insertHours(clinic) {
        const repo = this.dataSource.getRepository(clinic_hours_entity_1.ClinicHours);
        const weekdays = [0, 1, 2, 3, 4];
        const rows = [];
        for (const d of weekdays) {
            rows.push({ clinic, dayOfWeek: d, opensAt: '09:00', closesAt: '13:00' });
            rows.push({ clinic, dayOfWeek: d, opensAt: '14:00', closesAt: '17:30' });
        }
        await repo.save(rows);
    }
    async insertPractitioner(clinic) {
        const repo = this.dataSource.getRepository(practitioner_entity_1.Practitioner);
        return repo.save(repo.create({ clinic, name: 'Dr Ní Bhriain' }));
    }
    async insertServices(clinic) {
        const repo = this.dataSource.getRepository(service_entity_1.Service);
        return repo.save([
            repo.create({ clinic, name: 'Check-up', durationMinutes: 30, priceCents: 5000 }),
            repo.create({ clinic, name: 'Cleaning', durationMinutes: 45, priceCents: 8000 }),
            repo.create({ clinic, name: 'Filling', durationMinutes: 60, priceCents: 15000 }),
        ]);
    }
    async insertPatients(clinic) {
        const repo = this.dataSource.getRepository(patient_entity_1.Patient);
        return repo.save([
            repo.create({ clinic, name: 'Aisling O\'Brien', phone: '+353871111111', email: 'aisling@example.com' }),
            repo.create({ clinic, name: 'Conor Murphy', phone: '+353872222222', email: null }),
            repo.create({ clinic, name: 'Niamh Byrne', phone: '+353873333333', email: 'niamh@example.com' }),
            repo.create({ clinic, name: 'Darragh Kelly', phone: '+353874444444', email: null }),
            repo.create({ clinic, name: 'Saoirse Kavanagh', phone: '+353875555555', email: 'saoirse@example.com' }),
        ]);
    }
    async insertAppointments(clinic, practitioner, services, patients) {
        const repo = this.dataSource.getRepository(appointment_entity_1.Appointment);
        const now = new Date();
        const base = new Date(now);
        base.setUTCHours(9, 0, 0, 0);
        base.setUTCDate(base.getUTCDate() + 1);
        const makeAppt = (offsetDays, hour, minute, service, patient) => {
            const start = new Date(base);
            start.setUTCDate(base.getUTCDate() + offsetDays);
            start.setUTCHours(hour, minute, 0, 0);
            const end = new Date(start.getTime() + service.durationMinutes * 60_000);
            return repo.create({
                clinic,
                practitioner,
                patient,
                service,
                startsAt: start,
                endsAt: end,
            });
        };
        await repo.save([
            makeAppt(0, 9, 0, services[0], patients[0]),
            makeAppt(2, 13, 0, services[1], patients[1]),
            makeAppt(7, 14, 30, services[2], patients[2]),
        ]);
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SeederService);
//# sourceMappingURL=seeder.service.js.map