import { ConfigService } from '@nestjs/config';
import { BookingService } from '../booking/booking.service';
import { AgentContext, AgentReply } from './types';
import { Conversation } from '../entities/conversation.entity';
import { ConversationsService } from '../conversations/conversations.service';
export declare class AgentService {
    private readonly booking;
    private readonly conversations;
    private readonly logger;
    private readonly client;
    private readonly model;
    constructor(config: ConfigService, booking: BookingService, conversations: ConversationsService);
    handleMessage(ctx: AgentContext, conversation: Conversation, userMessage: string): Promise<AgentReply>;
    private runTool;
}
