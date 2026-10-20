import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './conversation.entity';


@Entity({ name: 'agent_actions' })
@Index(['conversation', 'createdAt'])
export class AgentAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, (c) => c.actions, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'conversation_id' })
    conversation: Conversation;

    @Column({ type: 'text', name: 'tool_name'})
    toolName: string;

    @Column({ type: 'jsonb'})
    input: unknown
    
    @Column({ type: 'jsonb'})
    output: unknown;

    @Column({ type: 'boolean' })
    succeeded: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}