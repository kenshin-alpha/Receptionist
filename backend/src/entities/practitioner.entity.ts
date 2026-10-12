import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
}   from 'typeorm';
import { Clinic } from './clinic.entity';

@Entity({ name: 'practitioners' })
export class Practitioner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Clinic, (clinic) => clinic.practitioners, {
        onDelete: 'CASCADE',
    })
  
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @Column({ type: 'text' })
    name: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}