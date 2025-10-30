import { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resumeService';

const resumeService = new ResumeService();

export class ResumeController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;
      const resume = await resumeService.create(title);
      return res.status(201).json(resume);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const resumes = await resumeService.getAll();
      return res.json(resumes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resume = await resumeService.getById(id);
      return res.json(resume);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resume = await resumeService.update(id, req.body);
      return res.json(resume);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await resumeService.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Personal Info
  async updatePersonalInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const personalInfo = await resumeService.updatePersonalInfo(id, req.body);
      return res.json(personalInfo);
    } catch (error) {
      next(error);
    }
  }

  // Work Experience
  async addWorkExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workExperience = await resumeService.addWorkExperience(id, req.body);
      return res.status(201).json(workExperience);
    } catch (error) {
      next(error);
    }
  }

  async updateWorkExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workExperience = await resumeService.updateWorkExperience(id, req.body);
      return res.json(workExperience);
    } catch (error) {
      next(error);
    }
  }

  async deleteWorkExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await resumeService.deleteWorkExperience(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Education
  async addEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const education = await resumeService.addEducation(id, req.body);
      return res.status(201).json(education);
    } catch (error) {
      next(error);
    }
  }

  async updateEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const education = await resumeService.updateEducation(id, req.body);
      return res.json(education);
    } catch (error) {
      next(error);
    }
  }

  async deleteEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await resumeService.deleteEducation(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Skills
  async addSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const skill = await resumeService.addSkill(id, req.body);
      return res.status(201).json(skill);
    } catch (error) {
      next(error);
    }
  }

  async updateSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const skill = await resumeService.updateSkill(id, req.body);
      return res.json(skill);
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await resumeService.deleteSkill(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
