import { ExtendedError } from 'socket.io';
import { ApiError } from '../exceptions/apiError';
import { tokenService } from '../services/token.service';
import { IAuthSocket } from '../types/socket.type';

export function authSocketMiddleware(
	socket: IAuthSocket,
	next: (err?: ExtendedError) => void
) {
	const token =
		socket.handshake.auth.token ||
		socket.handshake.headers['authorization']?.split(' ')[1];
	if (!token) {
		return next(new Error('Authentication error'));
	}

	const userData = tokenService.validateAccessToken(token);

	if (!userData) {
		return next(new Error('Authentication error'));
	}

	socket.user = userData;
	next();
}
