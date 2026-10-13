import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Clinic } from '../src/entities/clinic.entity';
import { ClinicHours } from '../src/entities/clinic-hours.entity';
import { Practitioner } from '../src/entities/practitioner.entity';
import { Service } from '../src/entities/service.entity';
import { Patient } from '../src/entities/patient.entity';
import { BookingService } from '../src/booking/booking.service';

describe('Booking race condition', () => {
  let app: INestApplication;
  let booking: BookingService;
  let ds: DataSource;

  let clinicId: string;
  let practitionerId: string;
  let serviceId: string;
  let patientIds: string[];

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    booking = app.get(BookingService);
    ds = app.get(DataSource);

    // Fresh state.
    await ds.query(
      'TRUNCATE appointments, patients, services, clinic_hours, practitioners, clinics CASCADE;',
    );

    const clinics = ds.getRepository(Clinic);
    const hours = ds.getRepository(ClinicHours);
    const practs = ds.getRepository(Practitioner);
    const services = ds.getRepository(Service);
    const patients = ds.getRepository(Patient);

    const clinic = await clinics.save(
      clinics.create({ name: 'Race Test Clinic', timezone: 'Europe/Dublin', depositCents: 0 }),
    );
    clinicId = clinic.id;

    await hours.save(
      [0, 1, 2, 3, 4].flatMap((d) => [
        hours.create({ clinic, dayOfWeek: d, opensAt: '09:00', closesAt: '17:00' }),
      ]),
    );

    const prac = await practs.save(practs.create({ clinic, name: 'Dr Race' }));
    practitionerId = prac.id;

    const service = await services.save(
      services.create({ clinic, name: 'Check-up', durationMinutes: 30, priceCents: 5000 }),
    );
    serviceId = service.id;

    // 10 patients so each parallel attempt has its own.
    const savedPatients = await patients.save(
      Array.from({ length: 10 }, (_, i) =>
        patients.create({
          clinic,
          name: `Patient ${i}`,
          phone: `+353800000${String(i).padStart(3, '0')}`,
          email: null,
        }),
      ),
    );
    patientIds = savedPatients.map((p) => p.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('under 10 parallel bookings on the same slot, exactly 1 succeeds', async () => {
    // Pick a future slot: 7 days from now at 10:00 UTC.
    const slot = new Date();
    slot.setUTCDate(slot.getUTCDate() + 7);
    slot.setUTCHours(10, 0, 0, 0);

    const results = await Promise.allSettled(
      patientIds.map((patientId) =>
        booking.book({
          clinicId,
          practitionerId,
          patientId,
          serviceId,
          startsAtUtc: slot,
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(9);

    // All failures are the clean 409.
    for (const r of failed) {
      const reason = (r as PromiseRejectedResult).reason;
      expect(reason.status).toBe(409);
      expect(reason.message).toMatch(/Slot is no longer available/);
    }
  });
});