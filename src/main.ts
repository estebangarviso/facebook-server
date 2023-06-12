// import App from '@core/app';
// import { Env } from '@core/env';
// import { AppModule } from './app/app.module';
// import { env, schema, swaggerBuildDefinition } from '@config';
// async function bootstrap(): Promise<void> {
// 	// Environment
// 	await new Env<typeof env>().addEnv(env, schema).verifyEnv;
// 	// Application
// 	const app = await App.create(AppModule);

// 	// Rate limit
// 	app.enableRateLimit();

// 	// Swagger
// 	app.enableSwagger(swaggerBuildDefinition);

// 	await app.listen();
// }
// bootstrap();

import { encrypt, decrypt } from '@core/utils';
import { Logger } from '@core/services';
let mockUserId = '5f9d7a3b3f9d972b3f9d972b';
Logger.info('mockUserId: ', mockUserId);

mockUserId = encrypt(mockUserId);
Logger.info('encrypted mockUserId: ', mockUserId);

mockUserId = decrypt(mockUserId);
Logger.info('decrypted mockUserId: ', mockUserId);
