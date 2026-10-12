"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("../app.module");
const seeder_service_1 = require("./seeder.service");
async function run() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seeder = app.get(seeder_service_1.SeederService);
    try {
        await seeder.seed();
    }
    catch (err) {
        new common_1.Logger('Seed').error(err);
        process.exitCode = 1;
    }
    finally {
        await app.close();
    }
}
run();
//# sourceMappingURL=seed.js.map