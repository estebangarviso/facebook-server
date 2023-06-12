import { Global, Module } from '@core/decorators';
import { RedisProvider } from '@providers/redis';
import { env } from '@config';
import manager from 'cache-manager';
import redisStore from 'cache-manager-redis-store';
import { DynamicModule, OnModuleDestroy } from '@core/interfaces';
import { Logger } from '@core/services';

type Caching = typeof manager.caching;
type RedisCache = ReturnType<Caching>;
type RedisConfig = Parameters<Caching>[0];
export type RedisClient = ReturnType<RedisCache['store']['getClient']>;

@Global()
@Module({})
export class RedisModule implements OnModuleDestroy {
    private static _redis: RedisClient;

    private static readonly _config: RedisConfig = {
        store: redisStore,
        host: env.REDIS.HOST,
        port: env.REDIS.PORT,
        auth_pass: env.REDIS.PASSWORD,
        prefix: env.REDIS.PREFIX
    };

    onModuleDestroy() {
        Logger.warn(
            `[${this.constructor.name}] Disconnected: ${env.REDIS.HOST}`
        );

        return RedisModule._redis.quit();
    }

    static async forRoot(redisClient?: RedisClient): Promise<DynamicModule> {
        Logger.info(`[${this.constructor.name}] Connecting: ${env.REDIS.HOST}`);
        this._redis =
            redisClient || manager.caching(this._config).store?.getClient();

        if (!this._redis?.connected) {
            throw new Error(
                `[${this.constructor.name}] Connection failed: ${env.REDIS.HOST}`
            );
        } else {
            Logger.success(
                `[${this.constructor.name}] Connected: ${env.REDIS.HOST}`
            );
        }

        return {
            module: RedisModule,
            providers: [RedisProvider],
            exports: [RedisProvider]
        };
    }
}
