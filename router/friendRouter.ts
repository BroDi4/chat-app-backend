import { Router } from 'express';
import { friendController } from '../controllers/friendController';
import { authMiddleware } from '../middleware/authMiddleware';

export const friendRouter = Router();

friendRouter.post('/sendreq/:id', authMiddleware, friendController.sendRequest);

friendRouter.delete(
	'/deletereq/:id',
	authMiddleware,
	friendController.declineRequest
);

friendRouter.post(
	'/acceptreq:id',
	authMiddleware,
	friendController.acceptRequest
);

friendRouter.get('/requests', authMiddleware, friendController.getRequests);

friendRouter.get('/get/:status', authMiddleware, friendController.getFriends);

friendRouter.delete(
	'/delete/:id',
	authMiddleware,
	friendController.deleteFriend
);
