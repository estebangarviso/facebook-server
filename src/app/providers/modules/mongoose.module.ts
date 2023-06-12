import { env } from '@config';
import { Global, Module } from '@core/decorators';
import { connect, connection, ConnectOptions } from 'mongoose';
import { OnModuleInit, OnModuleDestroy } from '@core/interfaces';
import { Logger } from '@core/services';

@Global()
@Module({})
export class MongooseModule implements OnModuleDestroy, OnModuleInit {
    readonly connectionConfig: ConnectOptions = {
        dbName: env.MONGO.NAME,
        keepAlive: true,
        keepAliveInitialDelay: 300000
        // useNewUrlParser: true, // deprecated Mongoose v6+.
        // useUnifiedTopology: true, // deprecated Mongoose v6+.
    };

    private readonly _url: string = this.getUrl();

    constructor() {
        connection.once(
            'open',
            Logger.success.bind(
                Logger,
                `[${this.constructor.name}] Connected: ${env.MONGO.NAME}`
            )
        );
        connection.on(
            'close',
            Logger.error.bind(
                Logger,
                `[${this.constructor.name}] Disconnected: ${env.MONGO.NAME}`
            )
        );
        connection.on(
            'connecting',
            Logger.info.bind(
                Logger,
                `[${this.constructor.name}] Connecting: ${env.MONGO.NAME}`
            )
        );
        connection.on(
            'reconnected',
            Logger.success.bind(
                Logger,
                `[${this.constructor.name}] Reconnected:${env.MONGO.NAME}`
            )
        );
        connection.on(
            'error',
            Logger.error.bind(Logger, `[${this.constructor.name}] Error`)
        );
        connection.on(
            'disconnected',
            Logger.warn.bind(Logger, `[${this.constructor.name}] Disconnected`)
        );
        connection.on('fullsetup', () => {
            Logger.success.bind(
                Logger,
                `[${this.constructor.name}] Connected to all secondary databases`
            );
        });
    }

    public onModuleInit() {
        return connect(this._url, this.connectionConfig);
    }

    public onModuleDestroy(): Promise<void> {
        return connection.close();
    }

    private getUrl(): string {
        if (this._url) return this._url;
        const auth =
            env.MONGO.USER && env.MONGO.PASSWORD
                ? `${env.MONGO.USER}:${env.MONGO.PASSWORD}@`
                : '';
        const port = env.MONGO.PORT ? `:${env.MONGO.PORT}` : '';
        const params = env.MONGO.PARAMS ? `?${env.MONGO.PARAMS}` : '';

        return `${env.MONGO.PROTOCOL}://${auth}${env.MONGO.HOST}${port}/${env.MONGO.NAME}${params}`;
    }
}
