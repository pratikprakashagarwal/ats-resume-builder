import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();
const controller = new AIController();

router.post('/generate-summary', (req, res, next) =>
  controller.generateSummary(req, res, next)
);
router.post('/enhance-bullet', (req, res, next) =>
  controller.enhanceBullet(req, res, next)
);
router.post('/suggest-skills', (req, res, next) =>
  controller.suggestSkills(req, res, next)
);
router.post('/tailor-resume', (req, res, next) =>
  controller.tailorResume(req, res, next)
);

export default router;
