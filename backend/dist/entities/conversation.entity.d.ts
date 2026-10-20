import { Clinic } from './clinic.entity';
import { Patient } from './patient.entity';
import { Message } from './message.entity';
import { AgentAction } from './agent-action.entity';
export type Channel = 'whatsapp' | 'web_chat';
export declare class Conversation {
    id: string;
    clinic: Clinic;
    patient: Patient | null;
    channel: Channel;
    channelIdentifier: string;
    createdAt: Date;
    messages: Message[];
    actions: AgentAction[];
}
