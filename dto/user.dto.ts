import type { User, userStatus } from '@prisma/client';

export class UserDto {
	id: number;
	email: string;
	uniqueName: string;
	nickName: string;
	avatarUrl: string | null;
	online: Boolean;
	status: userStatus;
	constructor(model: User) {
		this.id = model.id;
		this.email = model.email;
		this.uniqueName = model.uniqueName;
		this.nickName = model.nickName;
		this.avatarUrl = model.avatarUrl;
		this.online = model.online;
		this.status = model.status;
	}
}
