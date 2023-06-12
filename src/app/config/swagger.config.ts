import { ISwaggerBuildDefinition } from 'swagger-express-ts/swagger.builder';
import { env } from '@config';

export const swaggerBuildDefinition: ISwaggerBuildDefinition = {
	openapi: '3.0.1',
	info: {
		title: env.APP.INFO.TITLE,
		version: env.APP.INFO.VERSION,
		description: env.APP.INFO.DESCRIPTION
	},
	basePath: '/api',
	schemes: ['http', 'https'],
	securityDefinitions: {
		Bearer: {
			type: 'bearer',
			name: 'Authorization',
			in: 'header'
		}
	}
};
