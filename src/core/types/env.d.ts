import { LogLevelDesc } from 'loglevel';
declare global {
	namespace NodeJS {
		// ! booleans are not supported and number must be casted using + operator
		interface ProcessEnv {
			// SECTION: General config
			NODE_ENV: 'development' | 'production' | 'test';
			ENV: 'dev' | 'prod' | 'release' | 'staging' | 'stg' | 'qa';
			PORT: string;
			CORS_ORIGIN_WHITELIST: string;
			HOSTNAME?: string;
			MAINTENANCE_MODE?: 'true' | 'false';
			MAINTENANCE_MODE_WHITELIST_IPS?: string;
			LOG_LEVEL?: LogLevelDesc;
		}
	}

	// SECTION: global custom types
	type CryptoHash = {
		hash: string;
		salt: string;
	};
}
export {};
