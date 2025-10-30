import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Resume } from './Resume.entity';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ type: 'varchar', length: 255 })
    institution!: string;

  @Column({ type: 'varchar', length: 255 })
    degree!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    fieldOfStudy!: string;

  @Column({ type: 'date' })
    startDate!: Date;

  @Column({ type: 'date', nullable: true })
    endDate!: Date;

  @Column({ type: 'boolean', default: false })
    current!: boolean;

  @Column({ type: 'text', nullable: true })
    description!: string;

  @Column({ type: 'int', default: 0 })
    order!: number;

  @ManyToOne(() => Resume, (resume) => resume.education, {
        onDelete: 'CASCADE',
    })
    resume!: Resume;
}