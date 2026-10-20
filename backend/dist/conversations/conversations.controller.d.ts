import { ConversationsService } from './conversations.service';
export declare class ConversationsController {
    private readonly convos;
    constructor(convos: ConversationsService);
    list(clinicId: string): Promise<import("../entities/conversation.entity").Conversation[]>;
    get(id: string): Promise<{
        conversation: import("../entities/conversation.entity").Conversation;
        messages: import("../entities/message.entity").Message[];
        actions: import("../entities/agent-action.entity").AgentAction[];
    }>;
}
