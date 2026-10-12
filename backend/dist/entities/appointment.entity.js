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
exports.Appointment = void 0;
const typeorm_1 = require("typeorm");
const clinic_entity_1 = require("./clinic.entity");
const practitioner_entity_1 = require("./practitioner.entity");
const patient_entity_1 = require("./patient.entity");
const service_entity_1 = require("./service.entity");
let Appointment = class Appointment {
    id;
    clinic;
    practitioner;
    patient;
    service;
    startsAt;
    endsAt;
    status;
    depositStatus;
    createdAt;
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clinic_entity_1.Clinic, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'clinic_id' }),
    __metadata("design:type", clinic_entity_1.Clinic)
], Appointment.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => practitioner_entity_1.Practitioner, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'practitioner_id' }),
    __metadata("design:type", practitioner_entity_1.Practitioner)
], Appointment.prototype, "practitioner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], Appointment.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_entity_1.Service, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", service_entity_1.Service)
], Appointment.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'starts_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "startsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'ends_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "endsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'booked' }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'deposit_status', default: 'none' }),
    __metadata("design:type", String)
], Appointment.prototype, "depositStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)({ name: 'appointments' }),
    (0, typeorm_1.Index)(['practitioner', 'startsAt'])
], Appointment);
//# sourceMappingURL=appointment.entity.js.map