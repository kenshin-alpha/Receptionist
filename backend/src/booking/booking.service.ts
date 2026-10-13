import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { DateTime, Interval } from 'luxon';

import { Clinic } from '../entities/clinic.entity';
import { ClinicHours } from '../entities/clinic-hours.entity';
import { Service } from '../entities/service.entity';
import { Appointment } from '../entities/appointment.entity';

export interface AvailabilityQuery {
    clinicId: string;
    practitionerId: string;
    serviceId: string;
    fromUtc: Date; // inclusive
    toUtc: Date;   // exclusive
    stepMinutes?: number; // optional, default to 15
}

export interface Slot {
    startsAt: Date;
    endsAt: Date;
}

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Clinic) private readonly clinics: Repository<Clinic>,
        @InjectRepository(ClinicHours) private readonly hours: Repository<ClinicHours>,
        @InjectRepository(Service) private readonly services: Repository<Service>,
        @InjectRepository(Appointment) private readonly appointments: Repository<Appointment>,
    ) {}

    async getAvailableSlots(q: AvailabilityQuery): Promise<Slot[]> {
        const step = q.stepMinutes ?? 15;

        const clinic = await this.clinics.findOneBy({  id: q.clinicId } );
        if(!clinic)  throw new NotFoundException(`Clinic not found`);

        const service = await this.services.findOneBy({ id: q.serviceId });
        if(!service) throw new NotFoundException(`Service not found`);

        // 1. Opening-hours windows for this clinic, by day-of-week.
        const hoursRows = await this.hours.find({
            where: { clinic: {id: q.clinicId} }
        });

        // Index by dayOfWeek for cheap lookup.
        const hoursByDay: Map<number, {opensAt: string, closesAt: string}[]> = new Map();


        for (const h of hoursRows) {
            const list = hoursByDay.get(h.dayOfWeek) ?? [];
            list.push({ opensAt: h.opensAt, closesAt: h.closesAt });
            hoursByDay.set(h.dayOfWeek, list);
        }

        // 2. All booked appointments for this practitioner in the range.
        const existing = await this.appointments.find({
            where: {
                practitioner: { id: q.practitionerId },
                status: 'booked',
                startsAt: Between(q.fromUtc, q.toUtc)
            },
        });

        const busy = existing.map((a) => Interval.fromDateTimes(a.startsAt, a.endsAt));

        // 3. Walk each day in the range, in the clinic's timezone.
        const zone = clinic.timezone;
        const serviceDur = service.durationMinutes;
        
        const slots: Slot[] = [];
        let cursor = DateTime.fromJSDate(q.fromUtc, { zone }).startOf('day');
        const end = DateTime.fromJSDate(q.toUtc, { zone });

        while (cursor < end) {
            const dow = (cursor.weekNumber + 6) % 7; // luxon 1=Mon..7=Sun, Our Schema 0=Mon..6=Sun
            const windows = hoursByDay.get(dow) ?? [];

            for (const w of windows) {
                const [oH, oM] = w.opensAt.split(':').map(Number);
                const [cH, cM] = w.closesAt.split(':').map(Number);

                let slotStart = cursor.set({ hour: oH, minute: oM, second: 0, millisecond: 0 });
                const windowClose = cursor.set({ hour: cH, minute: cM, second: 0, millisecond: 0 });

                while (slotStart.plus({ minutes: serviceDur }) <= windowClose) {
                    const slotEnd = slotStart.plus({ minutes: serviceDur });
                    const slotInterval = Interval.fromDateTimes(slotStart, slotEnd);

                    // Must be in the future, and not overlap any booked appointment.
                    const nowUtc = DateTime.utc();
                    const isFuture = slotStart.toUTC() > nowUtc;
                    const overlapsBusy = busy.some((b) => b.overlaps(slotInterval));

                    if(isFuture && !overlapsBusy) {
                        slots.push({
                            startsAt: slotStart.toUTC().toJSDate(),
                            endsAt: slotEnd.toUTC().toJSDate(),
                        });
                    }

                    slotStart = slotStart.plus({ minutes: step });
                }
            }
            cursor = cursor.plus({ days: 1 });

        }
        return slots;
    }
}

