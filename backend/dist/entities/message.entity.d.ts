import { Conversation } from './conversation.entity';
export type MessageRole = 'patient' | 'agent' | 'system';
export declare class Message {
    id: string;
    conversation: Conversation;
    role: MessageRole;
    content: string;
    createdAt: Date;
}
