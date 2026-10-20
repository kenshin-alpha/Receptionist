import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { BookingService } from '../booking/booking.service';
import { tools } from './tools';
import { buildSystemPrompt } from './system-prompt';
import { AgentContext, AgentReply, ChatMessage } from './types';
import { Conversation } from '../entities/conversation.entity';
import { ConversationsService } from '../conversations/conversations.service';

const MAX_TOOL_ITERATIONS = 6;

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);
    private readonly client: Groq;
    private readonly model: string;

    constructor(
        config: ConfigService,
        private readonly booking: BookingService,
        private readonly conversations: ConversationsService,
    ) {
        this.client = new Groq({ apiKey: config.getOrThrow<string>('GROQ_API_KEY')});
        this.model = config.get<string>('GROQ_MODEL') ?? 'llama-3.3-70b-versatile';
    }

    async handleMessage(
        ctx: AgentContext,
        conversation: Conversation,
        userMessage: string,
    ): Promise<AgentReply> {
        await this.conversations.appendMessage(conversation, 'patient', userMessage);

        const history = await this.conversations.getHistoryForLLM(conversation, 20);
        const messages: ChatMessage[] = [
            { role: 'system', content: buildSystemPrompt(ctx) },
            ...history,
            { role: 'user', content: userMessage },
        ]

        const auditLog: AgentReply['toolCalls'] = [];

        for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: messages as any,
                tools: tools as any,
                tool_choice: 'auto',
                temperature: 0.3,
            });

            const choice = completion.choices[0].message;
            // If the LLM wants to call tools, run them and loop.
            if(choice.tool_calls && choice.tool_calls.length > 0) {
                messages.push({
                    role: 'assistant',
                    content: choice.content ?? null,
                    tool_calls: choice.tool_calls as any,
                });

                for (const call of choice.tool_calls) {
                    const name = call.function.name;
                    let args: any = {};
                    try {
                        args = JSON.parse(call.function.arguments || '{}');
                    } catch {
                        // fall through - we'll report back a parse error
                    }

                    const {ok, result} = await this.runTool(ctx, name, args);
                    auditLog.push({ name, args, result, succeeded:ok});

                    // Persist tool call to the audit log table.
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

            // Persist the agent's final reply
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
    
    private async runTool(
        ctx: AgentContext,
        name: string,
        args: any,
    ): Promise<{ok: boolean; result:any}> {
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

                    return { ok: true, result: { slots : slots.slice(0,20)}};
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
                        result : {
                            appointmentId: appt.id,
                            startsAt: appt.startsAt,
                            endsAt: appt.endsAt,
                        },
                    };
                }
                case 'reschedule_appointment': {
                    const appt = await this.booking.reschedule(
                        args.appointmentId,
                        new Date(args.newStartsAtUtc),
                    );
                    return { ok: true, result: { appointmentId: appt.id, startsAt: appt.startsAt}};
                }
                case 'cancel_appointment': {
                    const appt = await this.booking.cancel(args.appointmentId);
                    return { ok: true, result: { appointmentId: appt.id, status: appt.status }}
                }
                default: 
                return { ok: false, result:{ error: `Unknown tool : ${name}`}};
            }
        } catch (err: any) {
            // Translate backend errors to something the LLM can act on.
            return {
                ok: false,
                result: {
                    error: err?.response?.message ?? err?.message ?? 'Tool Failed',
                },
            };
        }
    }
}