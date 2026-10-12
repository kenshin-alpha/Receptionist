import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeederService);
  try {
    await seeder.seed();
  } catch (err) {
    new Logger('Seed').error(err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();