import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/apiError';
import { tokenService } from '../services/token.service';

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return next(ApiError.unauthorizedError());
	}

	const accessToken = authHeader.split(' ')[1];
	if (!accessToken) {
		return next(ApiError.unauthorizedError());
	}

	const userData = tokenService.validateAccessToken(accessToken);
	if (!userData) {
		return next(ApiError.unauthorizedError());
	}

	req.body.user = userData;
	next();
}
