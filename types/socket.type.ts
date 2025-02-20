import { Socket } from 'socket.io';
import { UserDto } from '../dto/user.dto';

export interface IAuthSocket extends Socket {
	user?: UserDto;
}
