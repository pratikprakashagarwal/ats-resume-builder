import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Resume } from '../entities/Resume.entity';
import { PersonalInfo } from '../entities/PersonalInfo.entity';
import { WorkExperience } from '../entities/WorkExperience.entity';
import { Education } from '../entities/Education.entity';
import { Skill } from '../entities/Skill.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [Resume, PersonalInfo, WorkExperience, Education, Skill],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
