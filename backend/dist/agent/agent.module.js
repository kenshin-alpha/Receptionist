"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_module_1 = require("../booking/booking.module");
const clinic_entity_1 = require("../entities/clinic.entity");
const practitioner_entity_1 = require("../entities/practitioner.entity");
const patient_entity_1 = require("../entities/patient.entity");
const service_entity_1 = require("../entities/service.entity");
const agent_service_1 = require("./agent.service");
const agent_controller_1 = require("./agent.controller");
const conversations_module_1 = require("../conversations/conversations.module");
let AgentModule = class AgentModule {
};
exports.AgentModule = AgentModule;
exports.AgentModule = AgentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            booking_module_1.BookingModule,
            conversations_module_1.ConversationsModule,
            typeorm_1.TypeOrmModule.forFeature([clinic_entity_1.Clinic, practitioner_entity_1.Practitioner, patient_entity_1.Patient, service_entity_1.Service]),
        ],
        providers: [agent_service_1.AgentService],
        controllers: [agent_controller_1.AgentController],
    })
], AgentModule);
//# sourceMappingURL=agent.module.js.map