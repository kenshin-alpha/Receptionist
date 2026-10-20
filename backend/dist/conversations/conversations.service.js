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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("../entities/conversation.entity");
const message_entity_1 = require("../entities/message.entity");
const agent_action_entity_1 = require("../entities/agent-action.entity");
let ConversationsService = class ConversationsService {
    convos;
    messages;
    actions;
    constructor(convos, messages, actions) {
        this.convos = convos;
        this.messages = messages;
        this.actions = actions;
    }
    async getOrCreate(input) {
        if (input.existingId) {
            const convo = await this.convos.findOne({
                where: { id: input.existingId },
                relations: { clinic: true, patient: true },
            });
            if (!convo)
                throw new common_1.NotFoundException('Conversation not found');
            return convo;
        }
        const existing = await this.convos.findOne({
            where: {
                clinic: { id: input.clinic.id },
                channel: input.channel,
                channelIdentifier: input.channelIdentifier,
            },
            relations: { clinic: true, patient: true },
        });
        if (existing)
            return existing;
        const created = this.convos.create({
            clinic: input.clinic,
            patient: input.patient,
            channel: input.channel,
            channelIdentifier: input.channelIdentifier,
        });
        return this.convos.save(created);
    }
    async appendMessage(conversation, role, content) {
        return this.messages.save(this.messages.create({ conversation, role, content }));
    }
    async appendAction(conversation, toolName, input, output, succeeded) {
        return this.actions.save(this.actions.create({
            conversation,
            toolName,
            input,
            output,
            succeeded,
        }));
    }
    async getHistoryForLLM(conversation, limit = 20) {
        const rows = await this.messages.find({
            where: { conversation: { id: conversation.id } },
            order: { createdAt: 'ASC' },
        });
        const slice = rows.slice(-limit);
        return slice.map((m) => ({
            role: m.role === 'patient' ? 'user' : 'assistant',
            content: m.content,
        }));
    }
    async listForClinic(clinicId) {
        return this.convos.find({
            where: { clinic: { id: clinicId } },
            relations: { patient: true },
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
    async getFull(id) {
        const convo = await this.convos.findOne({
            where: { id },
            relations: { clinic: true, patient: true },
        });
        if (!convo)
            throw new common_1.NotFoundException('Conversation not found');
        const [messages, actions] = await Promise.all([
            this.messages.find({
                where: { conversation: { id } },
                order: { createdAt: 'ASC' },
            }),
            this.actions.find({
                where: { conversation: { id } },
                order: { createdAt: 'ASC' },
            }),
        ]);
        return { conversation: convo, messages, actions };
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_action_entity_1.AgentAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map