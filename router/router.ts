import { Router } from 'express';
import { userRouter } from './userRouter';
import { friendRouter } from './friendRouter';

export const router = Router();

router.use('/user', userRouter);
router.use('/friend', friendRouter);
