import { Conversation } from './conversation.entity';
export declare class AgentAction {
    id: string;
    conversation: Conversation;
    toolName: string;
    input: unknown;
    output: unknown;
    succeeded: boolean;
    createdAt: Date;
}
