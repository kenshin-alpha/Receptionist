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
exports.ClinicHours = void 0;
const typeorm_1 = require("typeorm");
const clinic_entity_1 = require("./clinic.entity");
let ClinicHours = class ClinicHours {
    id;
    clinic;
    dayOfWeek;
    opensAt;
    closesAt;
};
exports.ClinicHours = ClinicHours;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClinicHours.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clinic_entity_1.Clinic, (clinic) => clinic.hours, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'clinic_id' }),
    __metadata("design:type", clinic_entity_1.Clinic)
], ClinicHours.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'day_of_week' }),
    __metadata("design:type", Number)
], ClinicHours.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', name: 'opens_at' }),
    __metadata("design:type", String)
], ClinicHours.prototype, "opensAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', name: 'closes_at' }),
    __metadata("design:type", String)
], ClinicHours.prototype, "closesAt", void 0);
exports.ClinicHours = ClinicHours = __decorate([
    (0, typeorm_1.Entity)({ name: 'clinic_hours' }),
    (0, typeorm_1.Unique)(['clinic', 'dayOfWeek', 'opensAt']),
    (0, typeorm_1.Check)(`"opens_at" < "closes_at"`)
], ClinicHours);
//# sourceMappingURL=clinic-hours.entity.js.map