import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { tokenService } from './token.service';
import { ApiError } from '../exceptions/apiError';
import { Response } from 'express';
import { IUserRegisterPayload, IUserTransfer } from '../types/user.type';
import { User } from '@prisma/client';
import { UserDto } from '../dto/user.dto';

class UserService {
	//generating and saving those tokens into db, returns userDto + tokens obj
	async createSession(userData: User): Promise<IUserTransfer> {
		const userDto = new UserDto(userData);
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { ...tokens, ...userDto };
	}

	//register user and creates session
	async register({
		uniqueName,
		email,
		password,
		nickName,
	}: IUserRegisterPayload) {
		const userByEmail = await prisma.user.findUnique({ where: { email } });
		if (userByEmail) {
			throw ApiError.badRequest(
				`Пользователь с почтовым адресом ${email} уже существует`
			);
		}

		const userByUnique = await prisma.user.findUnique({
			where: { uniqueName },
		});
		if (userByUnique) {
			throw ApiError.badRequest('Пользователь с таким именем уже существует');
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const registredUser = await prisma.user.create({
			data: {
				uniqueName,
				email,
				nickName,
				password: passwordHash,
			},
		});

		return await this.createSession(registredUser);
	}

	//login user and create session
	async login(email: string, password: string) {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw ApiError.badRequest('Пользователь с таким e-mail не был найден');
		}

		const passIsEqual = await bcrypt.compare(password, user.password);
		if (!passIsEqual) {
			throw ApiError.badRequest('Неверный e-mail или пароль');
		}

		return await this.createSession(user);
	}

	//set cookie into response, return obj of user ready for transfer
	setCookie(userData: IUserTransfer, res: Response) {
		res.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		const { refreshToken, ...user } = userData;
		return user;
	}

	async getUserInfo(user: IUserTransfer) {
		const userData = await prisma.user.findUnique({ where: { id: user.id } });
		if (!userData) {
			throw ApiError.unauthorizedError();
		}
		const userDto = new UserDto(userData);
		return userDto;
	}
}

export const userService = new UserService();
