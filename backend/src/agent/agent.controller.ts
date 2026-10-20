import {
    Body,
    Controller, 
    NotFoundException,
    Post
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { AgentService } from './agent.service';
import { Clinic } from '../entities/clinic.entity';
import { Practitioner } from '../entities/practitioner.entity';
import { Patient } from '../entities/patient.entity';
import { Service } from '../entities/service.entity';
import { ChatMessage } from './types';
import { ConversationsService } from '../conversations/conversations.service';

class ChatMessageDto {
    @IsString()
    role: 'user' | 'assistant' | 'system' | 'tool';

    @IsOptional()
    @IsString()
    content: string | null;
}

class ChatRequestDto {
    @IsUUID() clinicId: string;
    @IsUUID() practitionerId: string;
    @IsUUID() patientId: string;
    @IsString() message: string;

    @IsOptional()
    @IsUUID() conversationId?: string;
}

@Controller('agent')
export class AgentController {
    constructor(
        private readonly agent: AgentService,
        private readonly convos: ConversationsService,
        @InjectRepository(Clinic) private clinics: Repository<Clinic>,
        @InjectRepository(Practitioner) private practs: Repository<Practitioner>,
        @InjectRepository(Patient) private patients: Repository<Patient>,
        @InjectRepository(Service) private services: Repository<Service>,
    ){}

    @Post('chat')
    async chat(@Body() body: ChatRequestDto) {
        const clinic = await this.clinics.findOneBy({ id: body.clinicId});
        if(!clinic) throw new NotFoundException('Clinic not Found');

        const practitioner = await this.practs.findOneBy({ id: body.practitionerId });
        if(!practitioner) throw new NotFoundException('Practioner not Found');

        const patient = await this.patients.findOneBy({ id: body.patientId });
        if(!patient) throw new NotFoundException('Patient not found');

        const services = await this.services.find({ where: { clinic: { id: clinic.id}}})

        const conversation = await this.convos.getOrCreate({
            clinic,
            patient,
            channel: 'web_chat',
            channelIdentifier: `web: ${patient.id}`,
            existingId: body.conversationId,
        })

        const result = await this.agent.handleMessage( {
            clinicId: clinic.id,
            practitionerId: practitioner.id,
            patientId: patient.id,
            clinicName: clinic.name,
            clinicTimezone: clinic.timezone,
            practitionerName: practitioner.name,
            services: services.map((s) => ({
                id: s.id,
                name: s.name,
                durationMinutes: s.durationMinutes,
                priceCents: s.priceCents,
            })),
        },
        conversation,
        body.message,
        );
        return { conversationId: conversation.id, ...result };
    }
}