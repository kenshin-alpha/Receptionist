import { Repository } from 'typeorm';
import { Conversation, Channel } from '../entities/conversation.entity';
import { Message, MessageRole } from '../entities/message.entity';
import { AgentAction } from '../entities/agent-action.entity';
import { Clinic } from '../entities/clinic.entity';
import { Patient } from '../entities/patient.entity';
import { ChatMessage } from '../agent/types';
export declare class ConversationsService {
    private convos;
    private messages;
    private actions;
    constructor(convos: Repository<Conversation>, messages: Repository<Message>, actions: Repository<AgentAction>);
    getOrCreate(input: {
        clinic: Clinic;
        patient: Patient | null;
        channel: Channel;
        channelIdentifier: string;
        existingId?: string;
    }): Promise<Conversation>;
    appendMessage(conversation: Conversation, role: MessageRole, content: string): Promise<Message>;
    appendAction(conversation: Conversation, toolName: string, input: unknown, output: unknown, succeeded: boolean): Promise<AgentAction>;
    getHistoryForLLM(conversation: Conversation, limit?: number): Promise<ChatMessage[]>;
    listForClinic(clinicId: string): Promise<Conversation[]>;
    getFull(id: string): Promise<{
        conversation: Conversation;
        messages: Message[];
        actions: AgentAction[];
    }>;
}
