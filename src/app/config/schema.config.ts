import { JSONSchemaType } from 'ajv';
import { env } from './env.config';
import { CUSTOM_REGEX } from '@shared';

export const schema: JSONSchemaType<typeof env> = {
	type: 'object',
	properties: {
		APP: {
			type: 'object',
			properties: {
				INFO: {
					type: 'object',
					properties: {
						TITLE: {
							type: 'string'
						},
						HOME_PAGE: {
							type: 'string',
							format: 'uri'
						},
						DESCRIPTION: {
							type: 'string'
						},
						VERSION: {
							type: 'string'
						},
						AUTHOR: {
							type: 'object',
							properties: {
								NAME: {
									type: 'string'
								},
								EMAIL: {
									type: 'string',
									format: 'email'
								},
								URL: {
									type: 'string',
									format: 'uri'
								}
							},
							required: ['NAME', 'EMAIL', 'URL']
						},
						LICENSE: {
							type: 'object',
							properties: {
								NAME: {
									type: 'string'
								}
							},
							required: ['NAME']
						}
					},
					required: ['AUTHOR', 'LICENSE', 'HOME_PAGE', 'DESCRIPTION']
				},
				AUDIENCE: {
					type: 'string',
					format: 'uri'
				},
				ISSUER: {
					type: 'string',
					format: 'uri'
				}
			},
			required: ['INFO', 'AUDIENCE', 'ISSUER']
		},
		API: {
			type: 'object',
			properties: {
				COOKIE: {
					type: 'string',
					minLength: 3,
					enum: ['lax', 'strict', 'none']
				},
				ACCESS_TOKEN: {
					type: 'object',
					properties: {
						SECRET: {
							type: 'string',
							minLength: 1
						},
						EXPIRATION: {
							type: 'string',
							pattern: CUSTOM_REGEX.MS.toString().slice(1, -1)
						},
						BLACKLIST_KEY: {
							type: 'string',
							minLength: 1
						}
					},
					required: ['SECRET', 'EXPIRATION', 'BLACKLIST_KEY']
				},
				REFRESH_TOKEN: {
					type: 'object',
					properties: {
						SECRET: {
							type: 'string',
							minLength: 1
						},
						EXPIRATION: {
							type: 'string',
							pattern: CUSTOM_REGEX.MS.toString().slice(1, -1)
						}
					},
					required: ['SECRET', 'EXPIRATION']
				},
				POSTS: {
					type: 'object',
					properties: {
						MAX_MEDIA_SIZE: {
							type: 'number',
							minimum: 1
						},
						PAGE_SIZE: {
							type: 'number',
							minimum: 1
						}
					},
					required: ['PAGE_SIZE']
				}
			},
			required: ['ACCESS_TOKEN']
		},
		REDIS: {
			type: 'object',
			properties: {
				HOST: {
					type: 'string',
					format: 'hostname'
				},
				PORT: {
					type: 'number',
					minimum: 1,
					maximum: 65_535
				},
				PASSWORD: {
					type: 'string'
				},
				PREFIX: {
					type: 'string'
				},
				TTL: {
					type: 'object',
					properties: {
						USERS: {
							type: 'number',
							minimum: 1
						},
						POSTS: {
							type: 'number',
							minimum: 1
						}
					},
					required: ['USERS', 'POSTS']
				}
			},
			required: ['HOST', 'PORT', 'PASSWORD', 'PREFIX', 'TTL']
		},
		MONGO: {
			type: 'object',
			properties: {
				NAME: {
					type: 'string'
				},
				PROTOCOL: {
					type: 'string',
					enum: ['mongodb', 'mongodb+srv']
				},
				USER: {
					type: 'string'
				},
				PASSWORD: {
					type: 'string'
				},
				HOST: {
					type: 'string',
					format: 'hostname'
				},
				PORT: {
					type: 'number',
					minimum: 1,
					maximum: 65_535,
					nullable: true
				},
				PARAMS: {
					type: 'string'
				}
			},
			required: ['NAME', 'PROTOCOL', 'HOST']
		},
		AWS: {
			type: 'object',
			properties: {
				ACCESS_KEY_ID: {
					type: 'string'
				},
				SECRET_ACCESS_KEY: {
					type: 'string'
				},
				REGION: {
					type: 'string'
				},
				S3: {
					type: 'object',
					properties: {
						BUCKET_NAME: {
							type: 'string'
						},
						URL_EXPIRES_IN: {
							type: 'number',
							minimum: 1
						}
					},
					required: ['BUCKET_NAME', 'URL_EXPIRES_IN']
				},
				CLOUDFRONT: {
					type: 'object',
					properties: {
						DOMAIN_NAME: {
							type: 'string'
						},
						DISTRIBUTION_ID: {
							type: 'string'
						}
					},
					required: ['DOMAIN_NAME', 'DISTRIBUTION_ID']
				}
			},
			required: [
				'ACCESS_KEY_ID',
				'SECRET_ACCESS_KEY',
				'REGION',
				'S3',
				'CLOUDFRONT'
			]
		}
	},
	required: ['DEFAULTS', 'API', 'REDIS', 'MONGO', 'AWS'],
	additionalProperties: false
};
