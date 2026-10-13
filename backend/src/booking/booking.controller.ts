import { Controller, Get, Query, BadRequestException, Body, Param, Patch, Post, ParseUUIDPipe} from '@nestjs/common';
import { BookingService } from './booking.service';
import {AvailabilityQueryDto} from './dto/availability-query.dto';
import {BookAppointmentDto} from './dto/book-appointment.dto';
import {RescheduleAppointmentDto} from './dto/reschedule-appointment.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly booking: BookingService) {}

    @Get('availability')
    async availability(@Query() q: AvailabilityQueryDto) {
        if (!q.practitionerId || !q.clinicId || !q.serviceId || !q.from || !q.to) {
            throw new BadRequestException('Missing query parameters');
        }
        return this.booking.getAvailableSlots({clinicId: q.clinicId, practitionerId: q.practitionerId, serviceId: q.serviceId, fromUtc: new Date(q.from), toUtc: new Date(q.to)});
    }

    @Post('appointments')
    async book(
        @Body()
        body: BookAppointmentDto,
    )    
    {
        return this.booking.book({
            clinicId: body.clinicId,
            practitionerId: body.practitionerId,
            serviceId: body.serviceId,
            patientId: body.patientId,
            startsAtUtc: new Date(body.startsAt),
        });
    }

    @Patch('appointments/:id/cancel')
    async cancel(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.booking.cancel(id);
    }

    @Patch('appointments/:id/reschedule')
    async reschedule(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: RescheduleAppointmentDto,) {
        return this.booking.reschedule(id, new Date(body.startsAt));
    }
}