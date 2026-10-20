import { Repository } from 'typeorm';
import { AgentService } from './agent.service';
import { Clinic } from '../entities/clinic.entity';
import { Practitioner } from '../entities/practitioner.entity';
import { Patient } from '../entities/patient.entity';
import { Service } from '../entities/service.entity';
import { ConversationsService } from '../conversations/conversations.service';
declare class ChatRequestDto {
    clinicId: string;
    practitionerId: string;
    patientId: string;
    message: string;
    conversationId?: string;
}
export declare class AgentController {
    private readonly agent;
    private readonly convos;
    private clinics;
    private practs;
    private patients;
    private services;
    constructor(agent: AgentService, convos: ConversationsService, clinics: Repository<Clinic>, practs: Repository<Practitioner>, patients: Repository<Patient>, services: Repository<Service>);
    chat(body: ChatRequestDto): Promise<{
        reply: string;
        toolCalls: {
            name: string;
            args: unknown;
            result: unknown;
            succeeded: boolean;
        }[];
        conversationId: string;
    }>;
}
export {};
