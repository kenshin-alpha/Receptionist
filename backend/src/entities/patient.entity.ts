import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Clinic } from './clinic.entity';

@Entity({ name: 'patients' })
@Unique(['clinic', 'phone'])
export class Patient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Clinic, (clinic) => clinic.patients, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    phone: string;

    @Column({ type: 'text', nullable: true })
    email: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}