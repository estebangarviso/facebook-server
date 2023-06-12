/// <reference types="./../core/types/env.d.ts" />

declare global {
	namespace NodeJS {
		// ! booleans are not supported and number must be casted using + operator
		interface ProcessEnv {
			// API
			API_ACCESS_TOKEN_SECRET: string;
			API_ACCESS_TOKEN_EXPIRATION: string;
			API_ACCESS_TOKEN_BLACKLIST_KEY: string;
			API_REFRESH_TOKEN_SECRET: string;
			API_REFRESH_TOKEN_EXPIRATION: string;
			API_POSTS_MAX_MEDIA_SIZE: string;
			API_POSTS_PAGE_SIZE: string;
			// REDIS
			REDIS_HOST: string;
			REDIS_PORT: string;
			REDIS_PASSWORD: string;
			REDIS_PREFIX: string;
			// MONGO
			MONGO_URL: string;
			MONGO_NAME: string;
			MONGO_PROTOCOL: string;
			MONGO_USER: string;
			MONGO_PASSWORD: string;
			MONGO_HOST: string;
			MONGO_PORT: string;
			MONGO_PARAMS: string;
			// AWS
			AWS_ACCESS_KEY_ID: string;
			AWS_SECRET_ACCESS_KEY: string;
			AWS_REGION: string;
			AWS_S3_BUCKET_NAME: string;
			AWS_S3_URL_EXPIRES_IN: string;
			AWS_CLOUDFRONT_DOMAIN_NAME: string;
			AWS_CLOUDFRONT_DISTRIBUTION_ID: string;
		}
	}

	// SECTION: global custom types
	type Token = string;
	type Epoch = number;
	type BearerToken = `Bearer ${Token}`;
	interface SignedTokens {
		access_token: Token;
		refresh_token: Token;
	}
}

export {};
