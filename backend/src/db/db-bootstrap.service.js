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
var DbBootstrapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DbBootstrapService = DbBootstrapService_1 = class DbBootstrapService {
    dataSource;
    logger = new common_1.Logger(DbBootstrapService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        await this.dataSource.query(` CREATE EXTENSION IF NOT EXISTS btree_gist; `);
        const [existing] = await this.dataSource.query(`SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_appointments';`);
        if (!existing) {
            await this.dataSource.query(`
                ALTER TABLE appointments
                ADD CONSTRAINT no_overlapping_appointments EXCLUDE USING gist (
                    practitioner_id WITH =,
                    tstzrange(starts_at, ends_at, '[)') WITH &&
                ) WHERE (status = 'booked');
            `);
            this.logger.log('Added exclusion constraint no_overlapping_appointments');
        }
        else {
            this.logger.log('Exclusion constraint already present');
        }
    }
};
exports.DbBootstrapService = DbBootstrapService;
exports.DbBootstrapService = DbBootstrapService = DbBootstrapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DbBootstrapService);
//# sourceMappingURL=db-bootstrap.service.js.map