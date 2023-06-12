import { Global, Module } from '@core/decorators';
import { OnModuleAfterInit, OnModuleDestroy } from '@core/interfaces';
import { Logger, Socket } from '@core/services';
import { Server } from 'http';

@Global()
@Module({})
export class SocketModule implements OnModuleAfterInit, OnModuleDestroy {
    constructor() {
        Logger.info(`[${this.constructor.name}] Loaded`);
    }

    public async onModuleAfterInit(server: Server) {
        Socket.init(server);
    }

    public async onModuleDestroy() {
        // Disconnect Websocket
        Socket.close();
    }
}
