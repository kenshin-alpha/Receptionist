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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const booking_service_1 = require("../booking/booking.service");
const tools_1 = require("./tools");
const system_prompt_1 = require("./system-prompt");
const conversations_service_1 = require("../conversations/conversations.service");
const MAX_TOOL_ITERATIONS = 6;
let AgentService = AgentService_1 = class AgentService {
    booking;
    conversations;
    logger = new common_1.Logger(AgentService_1.name);
    client;
    model;
    constructor(config, booking, conversations) {
        this.booking = booking;
        this.conversations = conversations;
        this.client = new groq_sdk_1.default({ apiKey: config.getOrThrow('GROQ_API_KEY') });
        this.model = config.get('GROQ_MODEL') ?? 'llama-3.3-70b-versatile';
    }
    async handleMessage(ctx, conversation, userMessage) {
        await this.conversations.appendMessage(conversation, 'patient', userMessage);
        const history = await this.conversations.getHistoryForLLM(conversation, 20);
        const messages = [
            { role: 'system', content: (0, system_prompt_1.buildSystemPrompt)(ctx) },
            ...history,
            { role: 'user', content: userMessage },
        ];
        const auditLog = [];
        for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: tools_1.tools,
                tool_choice: 'auto',
                temperature: 0.3,
            });
            const choice = completion.choices[0].message;
            if (choice.tool_calls && choice.tool_calls.length > 0) {
                messages.push({
                    role: 'assistant',
                    content: choice.content ?? null,
                    tool_calls: choice.tool_calls,
                });
                for (const call of choice.tool_calls) {
                    const name = call.function.name;
                    let args = {};
                    try {
                        args = JSON.parse(call.function.arguments || '{}');
                    }
                    catch {
                    }
                    const { ok, result } = await this.runTool(ctx, name, args);
                    auditLog.push({ name, args, result, succeeded: ok });
                    await this.conversations.appendAction(conversation, name, args, result, ok);
                    messages.push({
                        role: 'tool',
                        tool_call_id: call.id,
                        name,
                        content: JSON.stringify(result),
                    });
                }
                continue;
            }
            const reply = (choice.content ?? '').trim();
            await this.conversations.appendMessage(conversation, 'agent', reply);
            return {
                reply: (choice.content ?? '').trim(),
                toolCalls: auditLog,
            };
        }
        this.logger.warn('Agent hit MAX_TOOL_ITERATIONS');
        const fallback = "I'm having trouble completing that right now. Let me put you through to a human - one moment.";
        await this.conversations.appendMessage(conversation, 'agent', fallback);
        return {
            reply: fallback,
            toolCalls: auditLog,
        };
    }
    async runTool(ctx, name, args) {
        try {
            switch (name) {
                case 'check_availability': {
                    const slots = await this.booking.getAvailableSlots({
                        clinicId: ctx.clinicId,
                        practitionerId: ctx.practitionerId,
                        serviceId: args.serviceId,
                        fromUtc: new Date(args.fromUtc),
                        toUtc: new Date(args.toUtc),
                    });
                    return { ok: true, result: { slots: slots.slice(0, 20) } };
                }
                case 'book_appointment': {
                    const appt = await this.booking.book({
                        clinicId: ctx.clinicId,
                        practitionerId: ctx.practitionerId,
                        patientId: ctx.patientId,
                        serviceId: args.serviceId,
                        startsAtUtc: new Date(args.startsAtUtc),
                    });
                    return {
                        ok: true,
                        result: {
                            appointmentId: appt.id,
                            startsAt: appt.startsAt,
                            endsAt: appt.endsAt,
                        },
                    };
                }
                case 'reschedule_appointment': {
                    const appt = await this.booking.reschedule(args.appointmentId, new Date(args.newStartsAtUtc));
                    return { ok: true, result: { appointmentId: appt.id, startsAt: appt.startsAt } };
                }
                case 'cancel_appointment': {
                    const appt = await this.booking.cancel(args.appointmentId);
                    return { ok: true, result: { appointmentId: appt.id, status: appt.status } };
                }
                default:
                    return { ok: false, result: { error: `Unknown tool : ${name}` } };
            }
        }
        catch (err) {
            return {
                ok: false,
                result: {
                    error: err?.response?.message ?? err?.message ?? 'Tool Failed',
                },
            };
        }
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = AgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        booking_service_1.BookingService,
        conversations_service_1.ConversationsService])
], AgentService);
//# sourceMappingURL=agent.service.js.map