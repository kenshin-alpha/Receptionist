import { BookingService } from './booking.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
export declare class BookingController {
    private readonly booking;
    constructor(booking: BookingService);
    availability(q: AvailabilityQueryDto): Promise<import("./booking.service").Slot[]>;
    book(body: BookAppointmentDto): Promise<import("../entities/appointment.entity").Appointment>;
    cancel(id: string): Promise<import("../entities/appointment.entity").Appointment>;
    reschedule(id: string, body: RescheduleAppointmentDto): Promise<import("../entities/appointment.entity").Appointment>;
}
