import { UserDto } from '../dto/user.dto';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { ITokens, TAccessToken, TRefreshToken } from '../types/token.type';
import { ApiError } from '../exceptions/apiError';
import { userService } from './user.service';

class TokenService {
	//Generates pair of tokens and return it
	generateTokens(payload: UserDto): ITokens {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
			expiresIn: '30m',
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
			expiresIn: '30d',
		});
		return { accessToken, refreshToken };
	}

	//save token into db
	async saveToken(userId: number, refreshToken: TRefreshToken) {
		await prisma.tokens.upsert({
			where: { userId },
			update: { refreshToken },
			create: { userId, refreshToken },
		});
	}

	//delete token from db
	async deleteToken(refreshToken: TRefreshToken) {
		const userData = this.validateRefreshToken(refreshToken);
		if (!userData) throw ApiError.unauthorizedError();

		await prisma.tokens.delete({ where: { userId: userData.id } });
	}

	//updates refresh token and creates session
	async updateToken(refreshToken: TRefreshToken) {
		if (!refreshToken) throw ApiError.unauthorizedError();

		const userData = this.validateRefreshToken(refreshToken);
		if (!userData) throw ApiError.unauthorizedError();

		const tokenFromDb = await prisma.tokens.findUnique({
			where: { userId: userData.id },
		});
		if (!tokenFromDb) throw ApiError.unauthorizedError();

		const user = await prisma.user.findUnique({ where: { id: userData.id } });
		if (!user) throw ApiError.unauthorizedError();

		return userService.createSession(user);
	}

	//validate jwt token
	validateToken(token: string, key: string) {
		try {
			const decoded = jwt.verify(token, key);
			return decoded as UserDto;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token: TRefreshToken) {
		return this.validateToken(token, process.env.JWT_REFRESH_SECRET_KEY);
	}

	validateAccessToken(token: TAccessToken) {
		return this.validateToken(token, process.env.JWT_ACCESS_SECRET_KEY);
	}
}

export const tokenService = new TokenService();
