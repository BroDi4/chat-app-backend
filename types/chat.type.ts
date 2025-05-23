import { Chat, ChatRole, Message, User } from '@prisma/client';
import { UserDto } from '../dto/user.dto';

export interface IMessage extends Message {
	user: User;
}

export interface IMessages {
	messages?: IMessage[];
}

export interface IChat extends Chat, IMessages {
	members: UserDto[];
}

export interface IChatRaw extends Chat, IMessages {
	members: { user: User; role: ChatRole; joinedAt: Date }[];
}
