import { Router } from 'express';

import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

export default router;
