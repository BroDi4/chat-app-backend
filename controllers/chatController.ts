import { NextFunction, Request, Response } from 'express';
import { chatService } from '../services/chat.service';

class ChatController {
	async getChats(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.body.user.id;

			const chats = await chatService.getChats(userId);
			res.json(chats);
		} catch (e) {
			next(e);
		}
	}

	async getMessages(req: Request, res: Response, next: NextFunction) {
		try {
			const chatId = req.params.chatid;
			const userId = req.body.user.id;

			const messages = await chatService.getMessages(Number(chatId), userId);
			res.json(messages);
		} catch (e) {
			next(e);
		}
	}
}

export const chatController = new ChatController();
