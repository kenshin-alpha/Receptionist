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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const agent_service_1 = require("./agent.service");
const clinic_entity_1 = require("../entities/clinic.entity");
const practitioner_entity_1 = require("../entities/practitioner.entity");
const patient_entity_1 = require("../entities/patient.entity");
const service_entity_1 = require("../entities/service.entity");
class ChatMessageDto {
    role;
    content;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ChatMessageDto.prototype, "content", void 0);
class ChatRequestDto {
    clinicId;
    practitionerId;
    patientId;
    message;
    history;
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "clinicId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "practitionerId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChatMessageDto),
    __metadata("design:type", Array)
], ChatRequestDto.prototype, "history", void 0);
let AgentController = class AgentController {
    agent;
    clinics;
    practs;
    patients;
    services;
    constructor(agent, clinics, practs, patients, services) {
        this.agent = agent;
        this.clinics = clinics;
        this.practs = practs;
        this.patients = patients;
        this.services = services;
    }
    async chat(body) {
        const clinic = await this.clinics.findOneBy({ id: body.clinicId });
        if (!clinic)
            throw new common_1.NotFoundException('Clinic not Found');
        const practitioner = await this.practs.findOneBy({ id: body.practitionerId });
        if (!practitioner)
            throw new common_1.NotFoundException('Practioner not Found');
        const patient = await this.patients.findOneBy({ id: body.patientId });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const services = await this.services.find({ where: { clinic: { id: clinic.id } } });
        return this.agent.handleMessage({
            clinicId: clinic.id,
            practitionerId: practitioner.id,
            patientId: patient.id,
            clinicName: clinic.name,
            clinicTimezone: clinic.timezone,
            practitionerName: practitioner.name,
            services: services.map((s) => ({
                id: s.id,
                name: s.name,
                durationMinutes: s.durationMinutes,
                priceCents: s.priceCents,
            })),
        }, (body.history ?? []), body.message);
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatRequestDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "chat", null);
exports.AgentController = AgentController = __decorate([
    (0, common_1.Controller)('agent'),
    __param(1, (0, typeorm_1.InjectRepository)(clinic_entity_1.Clinic)),
    __param(2, (0, typeorm_1.InjectRepository)(practitioner_entity_1.Practitioner)),
    __param(3, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(4, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [agent_service_1.AgentService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AgentController);
//# sourceMappingURL=agent.controller.js.map