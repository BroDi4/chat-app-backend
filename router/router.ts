import { Router } from 'express';
import { userRouter } from './userRouter';
import { friendRouter } from './friendRouter';
import { chatRouter } from './chatRouter';

export const router = Router();

router.use('/user', userRouter);
router.use('/friend', friendRouter);
router.use('/chat', chatRouter);
