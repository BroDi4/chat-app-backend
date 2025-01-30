import { UserDto } from '../dto/user.dto';
import { ApiError } from '../exceptions/apiError';
import { prisma } from '../lib/prisma';

class FriendService {
	async findUsers(firstUser: number, secondUser: number) {
		const users = await prisma.user.findMany({
			where: { id: { in: [firstUser, secondUser] } },
		});

		if (users.length < 2) {
			throw ApiError.badRequest('Один из пользователей не найден');
		}
		return users;
	}

	async findRequest(requestId: number, userId: number) {
		const request = await prisma.friendRequest.findUnique({
			where: { id: requestId },
		});

		if (!request || request.sentToId !== userId) {
			throw ApiError.badRequest('Запрос на добавление не найден');
		}
		return request;
	}

	async sendRequest(userId: number, reciverName: string) {
		const reciver = await prisma.user.findUnique({
			where: { uniqueName: reciverName },
		});

		if (!reciver) {
			throw ApiError.badRequest('Пользователь с таким именем не найден');
		}

		await this.findUsers(userId, reciver.id);

		const existingRequest = await prisma.friendRequest.findFirst({
			where: {
				OR: [
					{ sentById: userId, sentToId: reciver.id },
					{ sentById: reciver.id, sentToId: userId },
				],
			},
		});

		if (existingRequest) {
			throw ApiError.badRequest('Запрос на добавление уже был отправлен');
		}

		await prisma.friendRequest.create({
			data: {
				sentById: userId,
				sentToId: reciver.id,
			},
		});
	}

	async declineRequest(requestId: number, userId: number) {
		await this.findRequest(requestId, userId);

		await prisma.friendRequest.delete({ where: { id: requestId } });
	}

	async acceptRequest(requestId: number, userId: number) {
		const request = await this.findRequest(requestId, userId);

		await this.findUsers(request.sentById, request.sentToId);

		await prisma.$transaction([
			prisma.friendRequest.delete({ where: { id: requestId } }),
			prisma.user.update({
				where: { id: request.sentById },
				data: { friends: { connect: { id: request.sentToId } } },
			}),
			prisma.user.update({
				where: { id: request.sentToId },
				data: { friends: { connect: { id: request.sentById } } },
			}),
		]);
	}

	async getRequests(usetId: number) {
		const user = await prisma.user.findUnique({ where: { id: usetId } });

		if (!user) {
			throw ApiError.badRequest('Пользователь не найден');
		}

		const requests = await prisma.friendRequest.findMany({
			where: { sentToId: usetId },
			include: { sentBy: true },
		});

		const response = requests.map(obj => ({
			...obj,
			sentBy: new UserDto(obj.sentBy),
		}));

		return response;
	}

	async getFriends(status: string, userId: number, username: string) {
		const isOnline = status === 'true';

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				friends: {
					where: {
						...(isOnline ? { online: isOnline } : {}),
						...(username ? { nickName: { contains: username } } : {}),
					},
				},
			},
		});

		if (!user) {
			throw ApiError.badRequest('Пользователь не найден');
		}

		const friends = user.friends.map(item => new UserDto(item));

		return friends;
	}

	async deleteFriend(userId: number, friendId: number) {
		await this.findUsers(userId, friendId);

		await prisma.$transaction([
			prisma.user.update({
				where: { id: userId },
				data: { friends: { disconnect: { id: friendId } } },
			}),
			prisma.user.update({
				where: { id: friendId },
				data: { friends: { disconnect: { id: userId } } },
			}),
		]);
	}
}

export const friendService = new FriendService();
