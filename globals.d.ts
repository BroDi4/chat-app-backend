namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		DATABASE_URL: string;
		JWT_ACCESS_SECRET_KEY: string;
		JWT_REFRESH_SECRET_KEY: string;
	}
}
