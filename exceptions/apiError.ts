import { ValidationError } from 'express-validator';

export class ApiError extends Error {
	status: number;
	errors: ValidationError[];
	constructor(status: number, message: string, errors: ValidationError[] = []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}

	static unauthorizedError() {
		return new ApiError(401, 'Пользователь не авторизован');
	}

	static badRequest(message: string, errors: ValidationError[] = []) {
		return new ApiError(400, message, errors);
	}
}
