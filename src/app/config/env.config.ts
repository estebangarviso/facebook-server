import { env as defaultEnv } from '@core/env';

export const env = {
	APP: {
		INFO: {
			TITLE: process.env.APP_INFO_TITLE
				? process.env.APP_INFO_TITLE + ''
				: 'Api.SocialMedia',
			HOME_PAGE: process.env.APP_INFO_HOME_PAGE
				? process.env.APP_INFO_HOME_PAGE + ''
				: 'https://websocial.live',
			DESCRIPTION: process.env.APP_INFO_DESCRIPTION
				? process.env.APP_INFO_DESCRIPTION + ''
				: 'Backend for websocial',
			VERSION: process.env.APP_INFO_VERSION
				? process.env.APP_INFO_VERSION + ''
				: '1.0.0',
			AUTHOR: {
				NAME: 'Esteban Garviso',
				EMAIL: 'e.garvisovenegas@gmail.com',
				URL: 'https://github.com/estebangarviso'
			},
			LICENSE: {
				NAME: 'MIT'
			}
		},
		AUDIENCE: `${defaultEnv.URL.protocol}//${defaultEnv.URL.host}`,
		ISSUER: `${defaultEnv.URL.protocol}//${defaultEnv.URL.host}/api/auth`
	},
	API: {
		COOKIE: process.env.API_COOKIE + '',
		ACCESS_TOKEN: {
			SECRET: process.env.API_ACCESS_TOKEN_SECRET + '',
			EXPIRATION: process.env.API_ACCESS_TOKEN_EXPIRATION + '',
			BLACKLIST_KEY: process.env.API_ACCESS_TOKEN_BLACKLIST_KEY + ''
		},
		REFRESH_TOKEN: {
			SECRET: process.env.API_REFRESH_TOKEN_SECRET + '',
			EXPIRATION: process.env.API_REFRESH_TOKEN_EXPIRATION + ''
		},
		POSTS: {
			MAX_MEDIA_SIZE: process.env.API_POSTS_MAX_MEDIA_SIZE
				? +process.env.API_POSTS_MAX_MEDIA_SIZE
				: 5,
			PAGE_SIZE: process.env.API_POSTS_PAGE_SIZE
				? +process.env.API_POSTS_PAGE_SIZE
				: 6
		}
	},
	REDIS: {
		HOST: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
		PORT: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
		PASSWORD: process.env.REDIS_PASSWORD + '',
		PREFIX: process.env.REDIS_PREFIX + '',
		TTL: {
			USERS: process.env.REDIS_TTL_USERS
				? +process.env.REDIS_TTL_USERS
				: 3600,
			POSTS: process.env.REDIS_TTL_POSTS
				? +process.env.REDIS_TTL_POSTS
				: 3600
		}
	},
	MONGO: {
		NAME: process.env.MONGO_NAME + '',
		PROTOCOL: process.env.MONGO_PROTOCOL + 'mongodb',
		USER: process.env.MONGO_USER + '',
		PASSWORD: process.env.MONGO_PASSWORD + '',
		HOST: process.env.MONGO_HOST + '127.0.0.1',
		PORT: process.env.MONGO_PORT ? +process.env.MONGO_PORT : undefined,
		PARAMS: process.env.MONGO_PARAMS + ''
	},
	AWS: {
		ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID + '',
		SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY + '',
		REGION: process.env.AWS_REGION + '',
		S3: {
			BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME + '',
			URL_EXPIRES_IN: process.env.AWS_S3_URL_EXPIRES_IN
				? +process.env.AWS_S3_URL_EXPIRES_IN
				: 3600
		},
		CLOUDFRONT: {
			DOMAIN_NAME: process.env.AWS_CLOUDFRONT_DOMAIN_NAME + '',
			DISTRIBUTION_ID: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID + ''
		}
	}
};
