import { Repository } from 'typeorm';
import { AgentService } from './agent.service';
import { Clinic } from '../entities/clinic.entity';
import { Practitioner } from '../entities/practitioner.entity';
import { Patient } from '../entities/patient.entity';
import { Service } from '../entities/service.entity';
declare class ChatMessageDto {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string | null;
}
declare class ChatRequestDto {
    clinicId: string;
    practitionerId: string;
    patientId: string;
    message: string;
    history?: ChatMessageDto[];
}
export declare class AgentController {
    private readonly agent;
    private clinics;
    private practs;
    private patients;
    private services;
    constructor(agent: AgentService, clinics: Repository<Clinic>, practs: Repository<Practitioner>, patients: Repository<Patient>, services: Repository<Service>);
    chat(body: ChatRequestDto): Promise<import("./types").AgentReply>;
}
export {};
