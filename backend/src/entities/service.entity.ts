import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';

@Entity({ name: 'services'})
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Clinic, (clinic) => clinic.services, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;


    @Column({ type: 'int', name: 'duration_minutes' })
    durationMinutes: number;

    @Column({ type: 'int', name: 'price_cents' })
    priceCents: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}   
