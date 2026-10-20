import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { Patient } from './patient.entity';
import { Message } from './message.entity';
import { AgentAction } from './agent-action.entity';

export type Channel = 'whatsapp' | 'web_chat';

@Entity({ name: 'conversations' })
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Clinic, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @ManyToOne(() => Patient, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'patient_id' })
    patient: Patient | null;

    @Column({ type: 'text' })
    channel: Channel;

    @Column({ type: 'text', name: 'channel_identifier' })
    channelIdentifier: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
    createdAt: Date;

    @OneToMany(() => Message, (m) => m.conversation)
    messages: Message[];

    @OneToMany(() => AgentAction, (a) => a.conversation)
    actions: AgentAction[];
}