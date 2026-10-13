"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const luxon_1 = require("luxon");
const clinic_entity_1 = require("../entities/clinic.entity");
const clinic_hours_entity_1 = require("../entities/clinic-hours.entity");
const service_entity_1 = require("../entities/service.entity");
const appointment_entity_1 = require("../entities/appointment.entity");
let BookingService = class BookingService {
    clinics;
    hours;
    services;
    appointments;
    constructor(clinics, hours, services, appointments) {
        this.clinics = clinics;
        this.hours = hours;
        this.services = services;
        this.appointments = appointments;
    }
    async getAvailableSlots(q) {
        const step = q.stepMinutes ?? 15;
        const clinic = await this.clinics.findOneBy({ id: q.clinicId });
        if (!clinic)
            throw new common_1.NotFoundException(`Clinic not found`);
        const service = await this.services.findOneBy({ id: q.serviceId });
        if (!service)
            throw new common_1.NotFoundException(`Service not found`);
        const hoursRows = await this.hours.find({
            where: { clinic: { id: q.clinicId } }
        });
        const hoursByDay = new Map();
        for (const h of hoursRows) {
            const list = hoursByDay.get(h.dayOfWeek) ?? [];
            list.push({ opensAt: h.opensAt, closesAt: h.closesAt });
            hoursByDay.set(h.dayOfWeek, list);
        }
        const existing = await this.appointments.find({
            where: {
                practitioner: { id: q.practitionerId },
                status: 'booked',
                startsAt: (0, typeorm_2.Between)(q.fromUtc, q.toUtc)
            },
        });
        const busy = existing.map((a) => luxon_1.Interval.fromDateTimes(a.startsAt, a.endsAt));
        const zone = clinic.timezone;
        const serviceDur = service.durationMinutes;
        const slots = [];
        let cursor = luxon_1.DateTime.fromJSDate(q.fromUtc, { zone }).startOf('day');
        const end = luxon_1.DateTime.fromJSDate(q.toUtc, { zone });
        while (cursor < end) {
            const dow = (cursor.weekNumber + 6) % 7;
            const windows = hoursByDay.get(dow) ?? [];
            for (const w of windows) {
                const [oH, oM] = w.opensAt.split(':').map(Number);
                const [cH, cM] = w.closesAt.split(':').map(Number);
                let slotStart = cursor.set({ hour: oH, minute: oM, second: 0, millisecond: 0 });
                const windowClose = cursor.set({ hour: cH, minute: cM, second: 0, millisecond: 0 });
                while (slotStart.plus({ minutes: serviceDur }) <= windowClose) {
                    const slotEnd = slotStart.plus({ minutes: serviceDur });
                    const slotInterval = luxon_1.Interval.fromDateTimes(slotStart, slotEnd);
                    const nowUtc = luxon_1.DateTime.utc();
                    const isFuture = slotStart.toUTC() > nowUtc;
                    const overlapsBusy = busy.some((b) => b.overlaps(slotInterval));
                    if (isFuture && !overlapsBusy) {
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
    async book(input) {
        const service = await this.services.findOneBy({ id: input.serviceId });
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        const startsAt = input.startsAtUtc;
        const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);
        try {
            const appt = this.appointments.create({
                clinic: { id: input.clinicId },
                practitioner: { id: input.practitionerId },
                patient: { id: input.patientId },
                service: { id: input.serviceId },
                startsAt,
                endsAt,
                status: 'booked',
                depositStatus: 'none',
            });
            return await this.appointments.save(appt);
        }
        catch (err) {
            if (err?.code === '23P01' || /no_overlapping_appointments/.test(err?.message ?? '')) {
                throw new common_1.ConflictException('Slot is no longer available');
            }
            throw err;
        }
    }
    async cancel(appointmentId) {
        const appt = await this.appointments.findOneBy({ id: appointmentId });
        if (!appt)
            throw new common_1.NotFoundException('Appointment not found');
        if (appt.status === 'cancelled')
            return appt;
        appt.status = 'cancelled';
        return this.appointments.save(appt);
    }
    async reschedule(appointmentId, newStartUtc) {
        const appt = await this.appointments.findOne({
            where: { id: appointmentId },
            relations: { service: true },
        });
        if (!appt)
            throw new common_1.NotFoundException('Appointment not found');
        if (appt.status !== 'booked') {
            throw new common_1.ConflictException('Only booked appointments can be rescheduled');
        }
        appt.startsAt = newStartUtc;
        appt.endsAt = new Date(newStartUtc.getTime() + appt.service.durationMinutes * 60_000);
        try {
            return await this.appointments.save(appt);
        }
        catch (err) {
            if (err?.code === '23P01' || /no_overlapping_appointments/.test(err?.message ?? '')) {
                throw new common_1.ConflictException('Slot is no longer available');
            }
            throw err;
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(clinic_entity_1.Clinic)),
    __param(1, (0, typeorm_1.InjectRepository)(clinic_hours_entity_1.ClinicHours)),
    __param(2, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __param(3, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
//# sourceMappingURL=booking.service.js.map