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
let BookingController = class BookingController {
    booking;
    constructor(booking) {
        this.booking = booking;
    }
    async availability(practitionerId, clinicId, serviceId, from, to) {
        if (!practitionerId || !clinicId || !serviceId || !from || !to) {
            throw new common_1.BadRequestException('Missing query parameters');
        }
        return this.booking.getAvailableSlots({ clinicId, practitionerId, serviceId, fromUtc: new Date(from), toUtc: new Date(to) });
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)('availability'),
    __param(0, (0, common_1.Query)('practitionerId')),
    __param(1, (0, common_1.Query)('clinicId')),
    __param(2, (0, common_1.Query)('serviceId')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "availability", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map