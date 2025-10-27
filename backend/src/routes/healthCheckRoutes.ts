import { Router} from 'express';

import { healthCheck, meeps } from '../controllers/healthCheckController';

const router = Router();

router.get('/', healthCheck);
router.get('/meeps', meeps);

export default router;
