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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clinic = void 0;
const typeorm_1 = require("typeorm");
const clinic_hours_entity_1 = require("./clinic-hours.entity");
const practitioner_entity_1 = require("./practitioner.entity");
const service_entity_1 = require("./service.entity");
const patient_entity_1 = require("./patient.entity");
let Clinic = class Clinic {
    id;
    name;
    timezone;
    depositCents;
    createdAt;
    hours;
    practitioners;
    services;
    patients;
};
exports.Clinic = Clinic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Clinic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Clinic.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Clinic.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'deposit_cents', default: 0 }),
    __metadata("design:type", Number)
], Clinic.prototype, "depositCents", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Clinic.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => clinic_hours_entity_1.ClinicHours, (hours) => hours.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "hours", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => practitioner_entity_1.Practitioner, (p) => p.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "practitioners", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_entity_1.Service, (s) => s.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => patient_entity_1.Patient, (p) => p.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "patients", void 0);
exports.Clinic = Clinic = __decorate([
    (0, typeorm_1.Entity)({ name: 'clinics' })
], Clinic);
//# sourceMappingURL=clinic.entity.js.map