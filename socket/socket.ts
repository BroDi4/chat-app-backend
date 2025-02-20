import http from 'http';
import { Server } from 'socket.io';

export function initSocket(
	server: http.Server,
	corsOptions: { origin: string; credentials: boolean }
) {
	const io = new Server(server, {
		cors: corsOptions,
	});

	io.on('connection', socket => {
		console.log('User connected:', socket.id);
	});

	return io;
}
