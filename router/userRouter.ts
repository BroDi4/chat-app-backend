import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { userValidation } from '../middleware/validationMiddleware';

export const userRouter = Router();

userRouter.post('/login', userController.login);
userRouter.post('/register', userValidation, userController.register);
userRouter.get('/logout', userController.logout);
userRouter.get('/refresh', userController.refresh);
userRouter.get('/userinfo', authMiddleware, userController.info);
