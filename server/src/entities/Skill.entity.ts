import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Resume } from './Resume.entity';

export enum SkillCategory {
  TECHNICAL = 'Technical',
  SOFT_SKILLS = 'Soft Skills',
  LANGUAGES = 'Languages',
  TOOLS = 'Tools',
  OTHER = 'Other',
}

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ type: 'varchar', length: 255 })
    name!: string;

  @Column({
        type: 'enum',
        enum: SkillCategory,
        default: SkillCategory.TECHNICAL,
    })
    category!: SkillCategory;

  @Column({ type: 'int', default: 0 })
    order!: number;

  @ManyToOne(() => Resume, (resume) => resume.skills, {
        onDelete: 'CASCADE',
    })
    resume!: Resume;
}
