import { Logger } from '@core/services';
import { Module } from '@core/decorators';
import { AuthModule, PostsModule } from '@modules';
import { MongooseModule, RedisModule, SocketModule } from '@providers/modules';
import { env } from '@core/env';
import { OnModuleInit } from '@core/interfaces';
@Module({
	imports: [
		MongooseModule,
		RedisModule.forRoot(),
		SocketModule,
		AuthModule,
		PostsModule
	]
})
export class AppModule implements OnModuleInit {
	constructor(private readonly _logger: Logger) {}

	onModuleInit() {
		this._logger.success(`Application started at url: ${env.URL}`);
	}
}
