import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/aiService';

const aiService = new AIService();

export class AIController {
  async generateSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobTitle, yearsOfExperience } = req.body;

      if (!jobTitle) {
        return res.status(400).json({ message: 'Job title is required' });
      }

      const summary = await aiService.generateSummary(jobTitle, yearsOfExperience);
      return res.status(200).json({ summary });
    } catch (error) {
      next(error);
    }
  }

  async enhanceBullet(req: Request, res: Response, next: NextFunction) {
    try {
      const { bulletPoint, jobTitle } = req.body;

      if (!bulletPoint || !jobTitle) {
        return res.status(400).json({
          message: 'Bullet point and job title are required',
        });
      }

      const enhanced = await aiService.enhanceBulletPoint(bulletPoint, jobTitle);
      return res.status(200).json({ enhanced });
    } catch (error) {
      next(error);
    }
  }

  async suggestSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobDescription } = req.body;

      if (!jobDescription) {
        return res.status(400).json({ message: 'Job description is required' });
      }

      const skills = await aiService.suggestSkills(jobDescription);
      return res.status(200).json({ skills });
    } catch (error) {
      next(error);
    }
  }

  async tailorResume(req: Request, res: Response, next: NextFunction) {
    try {
      const { resumeContent, jobDescription } = req.body;

      if (!resumeContent || !jobDescription) {
        return res.status(400).json({
          message: 'Resume content and job description are required',
        });
      }

      const analysis = await aiService.tailorToJobDescription(resumeContent, jobDescription);
      return res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  }
}
