import { UserDto } from '../dto/user.dto';
import { ApiError } from '../exceptions/apiError';
import { prisma } from '../lib/prisma';
import { IChatRaw } from '../types/chat.type';

class ChatService {
	transformChatResponse(
		chat: IChatRaw,
		userId: number,
		isFullInfo: boolean = false
	) {
		const chatBaseInfo = {
			id: chat.id,
			name: chat.isGroup ? chat.name : null,
			isGroup: chat.isGroup,
			interlocutor: chat.isGroup
				? null
				: chat.members
						.map(member => new UserDto(member.user))
						.find(user => user.id !== userId) || null,
		};

		if (isFullInfo) {
			return {
				...chatBaseInfo,
				members: chat.members.map(member => ({
					...new UserDto(member.user),
					role: member.role,
					joinedAt: member.joinedAt,
				})),
				messages:
					chat.messages &&
					chat.messages.map(message => ({
						...message,
						user: new UserDto(message.user),
					})),
			};
		}

		return chatBaseInfo;
	}

	async getChats(userId: number) {
		const chats = await prisma.chat.findMany({
			where: { members: { some: { userId: userId } } },
			include: {
				members: {
					include: { user: true },
				},
			},
		});

		return chats.map(chat => this.transformChatResponse(chat, userId));
	}

	async getMessages(chatId: number, userId: number) {
		const chat = await prisma.chat.findUnique({
			where: { id: chatId, members: { some: { userId } } },
			include: {
				messages: { include: { user: true } },
				members: {
					include: { user: true },
				},
			},
		});

		if (!chat) {
			throw ApiError.notFoundError('Чат не был найден');
		}

		return this.transformChatResponse(chat, userId, true);
	}

	async createChat(
		createrId: number,
		isGroup: boolean,
		members: number[],
		name?: string
	) {
		const chat = await prisma.$transaction(async prisma => {
			const chat = await prisma.chat.create({
				data: isGroup ? { name: name, isGroup: isGroup } : { isGroup: isGroup },
			});

			await prisma.chatMember.createMany({
				data: [
					...members.map(id => ({
						userId: id,
						chatId: chat.id,
					})),
					{ userId: createrId, role: 'admin', chatId: chat.id },
				],
			});

			return chat;
		});

		return chat;
	}

	async sendMessage(
		userId: number,
		chatId: number,
		message: string,
		reciverId?: number
	) {
		const chat = await prisma.chat.findUnique({ where: { id: chatId } });

		if (!chat && reciverId) {
			return await prisma.$transaction(async prisma => {
				const { id: chatId } = await this.createChat(userId, false, [
					reciverId,
				]);
				const createdMessage = await prisma.message.create({
					data: { content: message, chatId, userId },
				});
				return createdMessage;
			});
		}

		return await prisma.message.create({
			data: { content: message, chatId, userId },
		});
	}
}

export const chatService = new ChatService();
