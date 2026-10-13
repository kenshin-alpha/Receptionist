import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    async book(input: {
        clinicId: string;
        practitionerId: string;
        patientId: string;
        serviceId: string;
        startsAtUtc: Date;
    }): Promise<Appointment> {
    const service = await this.services.findOneBy({ id: input.serviceId });
    if (!service) throw new NotFoundException('Service not found');

    const startsAt = input.startsAtUtc;
    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

    try {
        const appt = this.appointments.create({
            clinic: { id: input.clinicId } as any,
            practitioner: { id: input.practitionerId } as any,
            patient: { id: input.patientId } as any,
            service: { id: input.serviceId } as any,
            startsAt,
            endsAt,
            status: 'booked',
            depositStatus: 'none',
        });
        return await this.appointments.save(appt);
    } catch (err: any) {
        // Postgres exclusion-constraint violation = overlap with existing booked appt.
        if (err?.code === '23P01' || /no_overlapping_appointments/.test(err?.message ?? '')) {
            throw new ConflictException('Slot is no longer available');
            }
        throw err;
        }
    }

    async cancel(appointmentId: string): Promise<Appointment> {
        const appt = await this.appointments.findOneBy({ id: appointmentId });
        if (!appt) throw new NotFoundException('Appointment not found');
        if (appt.status === 'cancelled') return appt; // idempotent
        appt.status = 'cancelled';
        return this.appointments.save(appt);
    }

    async reschedule(appointmentId: string, newStartUtc: Date): Promise<Appointment> {
        const appt = await this.appointments.findOne({
            where: { id: appointmentId },
            relations: { service: true },
        });
        if (!appt) throw new NotFoundException('Appointment not found');
        if (appt.status !== 'booked') {
            throw new ConflictException('Only booked appointments can be rescheduled');
        }

        appt.startsAt = newStartUtc;
        appt.endsAt = new Date(newStartUtc.getTime() + appt.service.durationMinutes * 60_000);

        try {
            return await this.appointments.save(appt);
        } catch (err: any) {
            if (err?.code === '23P01' || /no_overlapping_appointments/.test(err?.message ?? '')) {
                throw new ConflictException('Slot is no longer available');
            }
        throw err;
        } 
    }
}

