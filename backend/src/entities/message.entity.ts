import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

export type MessageRole = 'patient' | 'agent' | 'system';

@Entity({ name: 'messages' })
@Index(['conversation', 'createdAt'])
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'conversation_id' })
    conversation: Conversation;

    @Column({ type: 'text' })
    role: MessageRole;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;
}