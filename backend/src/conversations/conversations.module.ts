import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { AgentAction } from '../entities/agent-action.entity';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Conversation, Message, AgentAction])],
    providers: [ConversationsService],
    controllers: [ConversationsController],
    exports: [ConversationsService],
})

export class ConversationsModule {}