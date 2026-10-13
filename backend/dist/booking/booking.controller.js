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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const availability_query_dto_1 = require("./dto/availability-query.dto");
const book_appointment_dto_1 = require("./dto/book-appointment.dto");
const reschedule_appointment_dto_1 = require("./dto/reschedule-appointment.dto");
let BookingController = class BookingController {
    booking;
    constructor(booking) {
        this.booking = booking;
    }
    async availability(q) {
        if (!q.practitionerId || !q.clinicId || !q.serviceId || !q.from || !q.to) {
            throw new common_1.BadRequestException('Missing query parameters');
        }
        return this.booking.getAvailableSlots({ clinicId: q.clinicId, practitionerId: q.practitionerId, serviceId: q.serviceId, fromUtc: new Date(q.from), toUtc: new Date(q.to) });
    }
    async book(body) {
        return this.booking.book({
            clinicId: body.clinicId,
            practitionerId: body.practitionerId,
            serviceId: body.serviceId,
            patientId: body.patientId,
            startsAtUtc: new Date(body.startsAt),
        });
    }
    async cancel(id) {
        return this.booking.cancel(id);
    }
    async reschedule(id, body) {
        return this.booking.reschedule(id, new Date(body.startsAt));
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)('availability'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_query_dto_1.AvailabilityQueryDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "availability", null);
__decorate([
    (0, common_1.Post)('appointments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [book_appointment_dto_1.BookAppointmentDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "book", null);
__decorate([
    (0, common_1.Patch)('appointments/:id/cancel'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)('appointments/:id/reschedule'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_appointment_dto_1.RescheduleAppointmentDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "reschedule", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map