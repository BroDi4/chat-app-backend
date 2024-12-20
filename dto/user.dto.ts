import type { User } from '@prisma/client';

export class UserDto {
	id: number;
	email: string;
	uniqueName: string;
	nickName: string;
	avatarUrl: string | null;
	constructor(model: User) {
		this.id = model.id;
		this.email = model.email;
		this.uniqueName = model.uniqueName;
		this.nickName = model.nickName;
		this.avatarUrl = model.avatarUrl;
	}
}
