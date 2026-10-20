import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, Channel } from '../entities/conversation.entity';
import { Message, MessageRole } from '../entities/message.entity';
import { AgentAction } from '../entities/agent-action.entity';
import { Clinic } from '../entities/clinic.entity';
import { Patient } from '../entities/patient.entity';
import { ChatMessage } from '../agent/types';


@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation) private convos: Repository<Conversation>,
        @InjectRepository(Message) private messages: Repository<Message>,
        @InjectRepository(AgentAction) private actions: Repository<AgentAction>,
    ) {}

    async getOrCreate(input: {
        clinic: Clinic,
        patient: Patient | null;
        channel: Channel;
        channelIdentifier: string;
        existingId?: string;
    }): Promise<Conversation> {
        if (input.existingId) {
            const convo = await this.convos.findOne({
                where: { id: input.existingId },
                relations: { clinic: true, patient: true },
            });
            if (!convo) throw new NotFoundException('Conversation not found');
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

        if (existing) return existing;

        const created = this.convos.create({
            clinic: input.clinic,
            patient: input.patient,
            channel: input.channel,
            channelIdentifier: input.channelIdentifier,
        });

        return this.convos.save(created);
    }

    async appendMessage(
        conversation: Conversation,
        role: MessageRole,
        content: string,
    ): Promise<Message> {
        return this.messages.save(
            this.messages.create({ conversation, role, content }),
        );
    }

    async appendAction(
        conversation: Conversation,
        toolName: string,
        input: unknown,
        output: unknown,
        succeeded: boolean,
    ): Promise<AgentAction> {
        return this.actions.save(
            this.actions.create({
                conversation,
                toolName,
                input,
                output,
                succeeded,
            }),
        );
    }

    // Rebuild the LLM-format history from the DB.
    async getHistoryForLLM(conversation: Conversation, limit = 20): Promise<ChatMessage[]> {
        const rows = await this.messages.find({
            where: { conversation: { id: conversation.id }},
            order: { createdAt: 'ASC' },
        });
        
        const slice = rows.slice(-limit); // trim to last N for context-window safety
        return slice.map((m) => ({
            role: m.role === 'patient' ? 'user' : 'assistant',
            content: m.content,
        }));
    }

    async listForClinic(clinicId: string) {
        return this.convos.find({
            where: { clinic: { id: clinicId } },
            relations: { patient: true },
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }

    async getFull(id: string) {
        const convo = await this.convos.findOne({
            where: { id },
            relations: { clinic: true, patient: true },
        });

        if (!convo) throw new NotFoundException('Conversation not found');

        const [messages, actions] = await Promise.all([
            this.messages.find({
                where: { conversation: { id } },
                order: { createdAt: 'ASC' },
            }),
            this.actions.find({
                where: { conversation: { id }},
                order: { createdAt: 'ASC' },
            }),
        ]);

        return { conversation: convo, messages, actions };
    }
}