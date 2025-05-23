import http from 'http';
import { Server } from 'socket.io';
import { userService } from '../services/user.service';
import { IAuthSocket } from '../types/socket.type';
import { friendService } from '../services/friend.service';
import { chatService } from '../services/chat.service';

export function initSocket(
	server: http.Server,
	corsOptions: { origin: string; credentials: boolean },
) {
	const io = new Server(server, {
		cors: corsOptions,
	});

	io.on('connection', async (socket: IAuthSocket) => {
		const prevUserData = socket.user;
		if (!prevUserData) return;

		const user = await userService.updateUser(prevUserData.id, {
			online: true,
		});
		const userId = user.id;
		socket.join(userId.toString());

		const friends = await friendService.getFriends('online', userId, '');

		friends.forEach(friend => {
			socket.to(friend.id.toString()).emit('changed_user');
		});

		socket.on('join_chat', chatId => {
			socket.join(chatId.toString());
		});

		socket.on('leave_chat', chatId => {
			socket.leave(chatId.toString());
		});

		socket.on('send_message', async ({ chatId, message }) => {
			const newMessage = await chatService.sendMessage(
				userId,
				Number(chatId),
				message,
			);

			io.to(chatId.toString()).emit('new_message', newMessage);
		});

		socket.on('disconnect', async () => {
			const sockets = await socket.in(userId.toString()).fetchSockets();
			const friends = await friendService.getFriends('online', userId, '');

			if (sockets.length !== 0) return;

			await userService.updateUser(userId, { online: false });

			friends.forEach(friend => {
				socket.to(friend.id.toString()).emit('changed_user');
			});
		});
	});

	return io;
}
