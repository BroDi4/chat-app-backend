import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { chatController } from '../controllers/chatController';

export const chatRouter = Router();

chatRouter.get('/getAll', authMiddleware, chatController.getChats);
chatRouter.get('/:chatid', authMiddleware, chatController.getMessages);
