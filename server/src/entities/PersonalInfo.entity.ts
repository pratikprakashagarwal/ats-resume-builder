import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Resume } from './Resume.entity';

@Entity('personal_info')
export class PersonalInfo {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ type: 'varchar', length: 255 })
    fullName!: string;

  @Column({ type: 'varchar', length: 255 })
    email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
    phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    location!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    linkedin!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
    website!: string;

  @Column({ type: 'text', nullable: true })
    summary!: string;

  @OneToOne(() => Resume, (resume) => resume.personalInfo, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    resume!: Resume;
}
