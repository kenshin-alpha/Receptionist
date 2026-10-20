import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
    constructor (private readonly convos: ConversationsService) {}

    @Get()
    async list(@Query('clinicId', new ParseUUIDPipe()) clinicId: string) {
        return this.convos.listForClinic(clinicId);
    }

    @Get(':id')
    async get(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.convos.getFull(id);
    }
}