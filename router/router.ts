import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userValidation } from '../middleware/validationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

export const router = Router();

router.post('/user/login', userController.login);
router.post('/user/register', userValidation, userController.register);
router.get('/user/logout', userController.logout);
router.get('/user/refresh', userController.refresh);
router.get('/user/userinfo', authMiddleware, userController.info);
