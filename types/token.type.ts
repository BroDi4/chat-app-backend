export type TRefreshToken = string;
export type TAccessToken = string;

export interface ITokens {
	accessToken: TAccessToken;
	refreshToken: TRefreshToken;
}
