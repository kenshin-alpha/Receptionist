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
exports.Service = void 0;
const typeorm_1 = require("typeorm");
const clinic_entity_1 = require("./clinic.entity");
let Service = class Service {
    id;
    clinic;
    durationMinutes;
    priceCents;
    createdAt;
};
exports.Service = Service;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Service.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clinic_entity_1.Clinic, (clinic) => clinic.services, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'clinic_id' }),
    __metadata("design:type", clinic_entity_1.Clinic)
], Service.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'duration_minutes' }),
    __metadata("design:type", Number)
], Service.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'price_cents' }),
    __metadata("design:type", Number)
], Service.prototype, "priceCents", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Service.prototype, "createdAt", void 0);
exports.Service = Service = __decorate([
    (0, typeorm_1.Entity)({ name: 'services' })
], Service);
//# sourceMappingURL=service.entity.js.map