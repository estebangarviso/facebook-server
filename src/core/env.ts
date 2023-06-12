import 'reflect-metadata';
import 'dotenv/config';
import { JSONSchemaType } from 'ajv';
import path from 'path';
import { ajv } from './utils/ajv.util';
import { Logger } from './services';
import { isNil } from './utils';
import { InternalServerErrorException } from './exceptions';
const PORT = process.env.PORT ? +process.env.PORT : 3001;

export const env = {
	NODE_ENV: process.env.NODE_ENV ?? 'development',
	ENV: process.env.ENV ?? 'dev',
	PORT,
	HOSTNAME: process.env.HOSTNAME + '' ?? 'localhost',
	LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
	CORS_ORIGIN_WHITELIST: process.env.CORS_ORIGIN_WHITELIST
		? process.env.CORS_ORIGIN_WHITELIST.split(',')
		: [],
	URL: new URL(process.env.URL ?? `http://localhost:${PORT}`),
	BASE_PATH: '/api',
	PUBLIC_DIR: path.join(process.cwd(), 'public'),
	MAINTENANCE: {
		MODE: process.env.MAINTENANCE_MODE === 'true',
		WHITELIST_IPS: process.env.MAINTENANCE_MODE_WHITELIST_IPS
			? process.env.MAINTENANCE_MODE_WHITELIST_IPS.split(',')
			: []
	}
};

export const schema: JSONSchemaType<typeof env> = {
	type: 'object',
	properties: {
		NODE_ENV: {
			type: 'string',
			enum: ['development', 'production', 'test']
		},
		ENV: {
			type: 'string',
			enum: ['dev', 'prod', 'release', 'stg', 'staging', 'qa']
		},
		PORT: {
			type: 'number',
			minimum: 1,
			maximum: 65_535
		},
		HOSTNAME: {
			type: 'string',
			format: 'hostname'
		},
		LOG_LEVEL: {
			type: 'string',
			enum: ['trace', 'debug', 'info', 'warn', 'error', 'silent']
		},
		CORS_ORIGIN_WHITELIST: {
			type: 'array',
			items: {
				type: 'string',
				format: 'hostname'
			},
			minItems: 1
		},
		URL: {
			type: 'object',
			required: ['href', 'protocol', 'host']
		},
		BASE_PATH: { type: 'string' },
		PUBLIC_DIR: { type: 'string', isDirectory: true },
		MAINTENANCE: {
			type: 'object',
			properties: {
				MODE: {
					type: 'boolean'
				},
				WHITELIST_IPS: {
					type: 'array',
					items: {
						type: 'string',
						format: 'hostname'
					}
				}
			},
			required: ['MODE']
		}
	},
	required: [
		'NODE_ENV',
		'PORT',
		'HOSTNAME',
		'LOG_LEVEL',
		'CORS_ORIGIN_WHITELIST',
		'URL',
		'URL',
		'BASE_PATH',
		'PUBLIC_DIR',
		'MAINTENANCE'
	]
};

/**
 * Clear console
 */
function clear() {
	process.stdout.write('\u001b[3J\u001b[1J');
	// eslint-disable-next-line no-console
	console.clear();
}
clear();

export class Env<E extends Record<string, unknown> = typeof env> {
	private _env: E;

	private _schema: JSONSchemaType<E>;

	private readonly invalidMessage = 'Invalid environment variables';

	public get env() {
		return this._env;
	}

	public get schema() {
		return this._schema;
	}

	public addEnv(env: E, schema: JSONSchemaType<E>) {
		if (!isNil(env)) {
			throw new InternalServerErrorException(
				'Environment variables already added'
			);
		}

		this._env = env;
		this._schema = schema;

		return this;
	}

	/**
	 * Verify environment variables
	 * @returns
	 * @throws
	 * @example
	 * ```ts
	 * await verifyEnv;
	 */
	// eslint-disable-next-line unicorn/consistent-function-scoping
	public verifyEnv: Promise<unknown> = new Promise((resolve, reject) => {
		if (isNil(this._env) || isNil(this._schema)) {
			reject(
				new InternalServerErrorException(
					'Environment variables not added'
				)
			);

			return;
		}
		const validator = ajv.compile(this._schema);
		const isValid = validator(this._env);
		if (!isValid) {
			reject(new InternalServerErrorException(this.invalidMessage));
			Logger.error(validator.errors);

			return;
		}

		resolve(
			process.env.NODE_ENV !== 'production'
				? Logger.success(this._env)
				: null
		);
	});
}
