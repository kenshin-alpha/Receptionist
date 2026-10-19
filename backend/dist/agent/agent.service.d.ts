import { ConfigService } from '@nestjs/config';
import { BookingService } from '../booking/booking.service';
import { AgentContext, AgentReply, ChatMessage } from './types';
export declare class AgentService {
    private readonly booking;
    private readonly logger;
    private readonly client;
    private readonly model;
    constructor(config: ConfigService, booking: BookingService);
    handleMessage(ctx: AgentContext, history: ChatMessage[], userMessage: string): Promise<AgentReply>;
    private runTool;
}
