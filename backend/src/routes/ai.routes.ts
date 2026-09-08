import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { authenticateAiService } from '../middleware/ai-auth.middleware';
import { validate } from '../middleware/validate';
import { aiEventSchema } from '../validators/ai.validators';

const router = Router();

router.use(authenticateAiService());

router.post('/events', validate(aiEventSchema), AiController.ingestEvent);

export default router;
