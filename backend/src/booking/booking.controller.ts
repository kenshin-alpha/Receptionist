import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
    constructor(private readonly booking: BookingService) {}

    @Get('availability')
    async availability(
        @Query('practitionerId') practitionerId: string,
        @Query('clinicId') clinicId: string,
        @Query('serviceId') serviceId: string,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        if (!practitionerId || !clinicId || !serviceId || !from || !to) {
            throw new BadRequestException('Missing query parameters');
        }
        return this.booking.getAvailableSlots({clinicId, practitionerId, serviceId, fromUtc: new Date(from), toUtc: new Date(to)});
    }
}