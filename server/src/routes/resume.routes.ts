import { NextFunction, Request, Response, Router } from 'express';
import { ResumeController } from '../controllers/resumeController';
import {
  validateResume,
  validatePersonalInfo,
  validateWorkExperience,
  validateEducation,
  validateSkill,
} from '../middleware/validation';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const router = Router();
const controller = new ResumeController();

// Resume routes
router.post('/', validateResume, (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => controller.create(req, res, next));
router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));
router.put('/:id', (req, res, next) => controller.update(req, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

// Personal Info
router.put('/:id/personal-info', validatePersonalInfo, (req: Request, res: Response, next: NextFunction) =>
  controller.updatePersonalInfo(req, res, next)
);

// Work Experience
router.post('/:id/work-experience', validateWorkExperience, (req: Request, res: Response, next: NextFunction) =>
  controller.addWorkExperience(req, res, next)
);
router.put('/work-experience/:id', validateWorkExperience, (req: Request, res: Response, next: NextFunction) =>
  controller.updateWorkExperience(req, res, next)
);
router.delete('/work-experience/:id', (req: Request, res: Response, next: NextFunction) =>
  controller.deleteWorkExperience(req, res, next)
);

// Education
router.post('/:id/education', validateEducation, (req: Request, res: Response, next: NextFunction) =>
  controller.addEducation(req, res, next)
);
router.put('/education/:id', validateEducation, (req: Request, res: Response, next: NextFunction) =>
  controller.updateEducation(req, res, next)
);
router.delete('/education/:id', (req, res, next) =>
  controller.deleteEducation(req, res, next)
);

// Skills
router.post('/:id/skills', validateSkill, (req: Request, res: Response, next: NextFunction) =>
  controller.addSkill(req, res, next)
);
router.put('/skills/:id', validateSkill, (req: Request, res: Response, next: NextFunction) =>
  controller.updateSkill(req, res, next)
);
router.delete('/skills/:id', (req: Request, res: Response, next: NextFunction) =>
  controller.deleteSkill(req, res, next)
);

export default router;
