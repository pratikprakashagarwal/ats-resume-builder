import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Index, // Import Index decorator
} from 'typeorm';
import { PersonalInfo } from './PersonalInfo.entity';
import { WorkExperience } from './WorkExperience.entity';
import { Education } from './Education.entity';
import { Skill } from './Skill.entity';

/**
 * Resume Entity - Represents the main resume table
 * Stores basic resume information and relationships to other entities
 * Indexes are added for frequently queried columns to improve performance
 */
@Entity('resumes')
@Index(['createdAt']) // Index for sorting by creation date
@Index(['updatedAt']) // Index for sorting by update date
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @Index() // Index for searching by title
  title!: string;

  @OneToOne(() => PersonalInfo, (info) => info.resume, { 
    cascade: true,
    eager: true,
  })
  personalInfo!: PersonalInfo;

  @OneToMany(() => WorkExperience, (exp) => exp.resume, { 
    cascade: true,
    eager: true,
  })
  workExperience!: WorkExperience[];

  @OneToMany(() => Education, (edu) => edu.resume, { 
    cascade: true,
    eager: true,
  })
  education!: Education[];

  @OneToMany(() => Skill, (skill) => skill.resume, { 
    cascade: true,
    eager: true,
  })
  skills!: Skill[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
