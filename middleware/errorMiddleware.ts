import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/apiError';

export function errorMiddleware(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof ApiError) {
		res.status(err.status).json({ message: err.message, errors: err.errors });
	} else {
		console.log(err);
		res
			.status(500)
			.json({ message: 'Произошла непредвиденная ошибка сервера' });
	}
}
