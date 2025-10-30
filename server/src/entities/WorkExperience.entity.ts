import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index, // Import Index
} from 'typeorm';
import { Resume } from './Resume.entity';

/**
 * WorkExperience Entity - Represents work experience entries
 * Composite index on resumeId and order for efficient querying
 */
@Entity('work_experience')
@Index(['resume', 'order']) // Composite index for filtering and sorting
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  companyName!: string;

  @Column({ type: 'varchar', length: 255 })
  position!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date;

  @Column({ type: 'boolean', default: false })
  current!: boolean;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @ManyToOne(() => Resume, (resume) => resume.workExperience, {
    onDelete: 'CASCADE',
  })
  @Index() // Index foreign key for faster joins
  resume!: Resume;
}
