import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { validationResult } from 'express-validator';
import { ApiError } from '../exceptions/apiError';
import { tokenService } from '../services/token.service';

class UserController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(ApiError.badRequest('Некорректные данные', errors.array()));
			}

			const { uniqueName, email, password } = req.body;
			const userData = await userService.register({
				uniqueName,
				email,
				password,
				nickName: uniqueName,
			});

			res.json(userService.setCookie(userData, res));
		} catch (e) {
			next(e);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const userData = await userService.login(email, password);

			res.json(userService.setCookie(userData, res));
		} catch (e) {
			next(e);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			await tokenService.deleteToken(refreshToken);
			res.clearCookie('refreshToken');
			res.json({ message: 'Вы вышли из аккаунта' });
		} catch (e) {
			next(e);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;

			const userData = await tokenService.updateToken(refreshToken);
			res.json(userService.setCookie(userData, res));
		} catch (e) {
			next(e);
		}
	}

	async info(req: Request, res: Response, next: NextFunction) {
		try {
			const { user } = req.body;
			const userData = await userService.getUserInfo(user);
			res.json(userData);
		} catch (e) {
			next(e);
		}
	}
}

export const userController = new UserController();
