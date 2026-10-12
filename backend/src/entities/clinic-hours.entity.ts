import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Clinic } from './clinic.entity';

// day_of_week uses ISO numbering: 0 = Monday ... 6 = Sunday
@Entity({ name: 'clinic_hours' })
@Unique(['clinic', 'dayOfWeek', 'opensAt'])
@Check(`"opens_at" < "closes_at"`)
export class ClinicHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.hours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;

  @Column({ type: 'int', name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ type: 'time', name: 'opens_at' })
  opensAt: string;

  @Column({ type: 'time', name: 'closes_at' })
  closesAt: string;
}