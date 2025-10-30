import { AppDataSource } from '../config/database.config';
import { Resume } from '../entities/Resume.entity';
import { PersonalInfo } from '../entities/PersonalInfo.entity';
import { WorkExperience } from '../entities/WorkExperience.entity';
import { Education } from '../entities/Education.entity';
import { Skill } from '../entities/Skill.entity';

const resumeRepository = AppDataSource.getRepository(Resume);
const personalInfoRepository = AppDataSource.getRepository(PersonalInfo);
const workExperienceRepository = AppDataSource.getRepository(WorkExperience);
const educationRepository = AppDataSource.getRepository(Education);
const skillRepository = AppDataSource.getRepository(Skill);

export class ResumeService {
  async create(title: string): Promise<Resume> {
    const resume = resumeRepository.create({ title });
    return await resumeRepository.save(resume);
  }

  async getAll(): Promise<Resume[]> {
    return await resumeRepository.find({
      relations: ['personalInfo', 'workExperience', 'education', 'skills'],
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<Resume> {
    const resume = await resumeRepository.findOne({
      where: { id },
      relations: ['personalInfo', 'workExperience', 'education', 'skills'],
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    return resume;
  }

  async update(id: string, data: Partial<Resume>): Promise<Resume> {
    const resume = await this.getById(id);
    Object.assign(resume, data);
    return await resumeRepository.save(resume);
  }

  async delete(id: string): Promise<void> {
    const resume = await this.getById(id);
    await resumeRepository.remove(resume);
  }

  // ==================== Personal Info ====================

  async updatePersonalInfo(resumeId: string, data: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const resume = await this.getById(resumeId);

    if (resume.personalInfo) {
      Object.assign(resume.personalInfo, data);
      return await personalInfoRepository.save(resume.personalInfo);
    } else {
      const personalInfo = personalInfoRepository.create({
        ...data,
        resume,
      });
      return await personalInfoRepository.save(personalInfo);
    }
  }

  // ==================== Work Experience ====================

  async addWorkExperience(resumeId: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    const resume = await this.getById(resumeId);
    
    const workExperience = workExperienceRepository.create({
      ...data,
      resume,
    });
    
    return await workExperienceRepository.save(workExperience);
  }

  async updateWorkExperience(id: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    const workExperience = await workExperienceRepository.findOne({
      where: { id },
    });

    if (!workExperience) {
      throw new Error('Work experience not found');
    }

    Object.assign(workExperience, data);
    return await workExperienceRepository.save(workExperience);
  }

  async deleteWorkExperience(id: string): Promise<void> {
    const workExperience = await workExperienceRepository.findOne({
      where: { id },
    });

    if (!workExperience) {
      throw new Error('Work experience not found');
    }

    await workExperienceRepository.remove(workExperience);
  }

  // ==================== Education ====================

  async addEducation(resumeId: string, data: Partial<Education>): Promise<Education> {
    const resume = await this.getById(resumeId);
    
    const education = educationRepository.create({
      ...data,
      resume,
    });
    
    return await educationRepository.save(education);
  }

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    const education = await educationRepository.findOne({
      where: { id },
    });

    if (!education) {
      throw new Error('Education not found');
    }

    Object.assign(education, data);
    return await educationRepository.save(education);
  }

  async deleteEducation(id: string): Promise<void> {
    const education = await educationRepository.findOne({
      where: { id },
    });

    if (!education) {
      throw new Error('Education not found');
    }

    await educationRepository.remove(education);
  }

  // ==================== Skills ====================

  async addSkill(resumeId: string, data: Partial<Skill>): Promise<Skill> {
    const resume = await this.getById(resumeId);
    
    const skill = skillRepository.create({
      ...data,
      resume,
    });
    
    return await skillRepository.save(skill);
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    const skill = await skillRepository.findOne({
      where: { id },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    Object.assign(skill, data);
    return await skillRepository.save(skill);
  }

  async deleteSkill(id: string): Promise<void> {
    const skill = await skillRepository.findOne({
      where: { id },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    await skillRepository.remove(skill);
  }
}
