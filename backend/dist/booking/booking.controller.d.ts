import { BookingService } from './booking.service';
export declare class BookingController {
    private readonly booking;
    constructor(booking: BookingService);
    availability(practitionerId: string, clinicId: string, serviceId: string, from: string, to: string): Promise<import("./booking.service").Slot[]>;
}
