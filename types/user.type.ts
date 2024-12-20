import type { UserDto } from '../dto/user.dto';
import { ITokens } from './token.type';

export interface IUserTransfer extends UserDto, ITokens {}

export interface IUserRegisterPayload {
	uniqueName: string;
	email: string;
	password: string;
	nickName: string;
	avatarUrl?: string;
}
