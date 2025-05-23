import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../exceptions/apiError';
import { friendService } from '../services/friend.service';

class FriendController {
	async sendRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const reciverUniqueName = req.params.uniquename;
			const userId = req.body.user.id;

			if (!reciverUniqueName) {
				throw ApiError.badRequest('Получатель не указан');
			}

			await friendService.sendRequest(userId, reciverUniqueName);
			res.json({ message: 'Вы отправили запрос в друзья!' });
		} catch (e) {
			next(e);
		}
	}

	async declineRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const requestId = req.params.id;
			const reciverId = req.body.user.id;

			if (!requestId) {
				throw ApiError.badRequest('Запрос не указан');
			}

			await friendService.declineRequest(Number(requestId), reciverId);
			res.json({ message: 'Запрос на добавления в друзья удален' });
		} catch (e) {
			next(e);
		}
	}

	async acceptRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const requestId = req.params.id;
			const reciverId = req.body.user.id;

			if (!requestId) {
				throw ApiError.badRequest('Запрос не указан');
			}

			await friendService.acceptRequest(Number(requestId), reciverId);
			res.json({ message: 'Запрос на добавление принят' });
		} catch (e) {
			next(e);
		}
	}

	async getRequests(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.body.user.id;

			const requests = await friendService.getRequests(userId);
			res.json(requests);
		} catch (e) {
			next(e);
		}
	}

	async getFriends(req: Request, res: Response, next: NextFunction) {
		try {
			const onlineStatus = req.params.status;
			const name = req.query.username as string;
			const userId = req.body.user.id;

			const friends = await friendService.getFriends(
				onlineStatus,
				userId,
				name
			);
			res.json(friends);
		} catch (e) {
			next(e);
		}
	}

	async deleteFriend(req: Request, res: Response, next: NextFunction) {
		try {
			const friendId = req.params.id;
			const userId = req.body.user.id;

			await friendService.deleteFriend(userId, Number(friendId));

			res.json({ message: 'Друг был удален' });
		} catch (e) {
			next(e);
		}
	}
}

export const friendController = new FriendController();
