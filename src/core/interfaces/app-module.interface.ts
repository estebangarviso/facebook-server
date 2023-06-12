import {
    OnModuleInit,
    OnModuleAfterInit,
    OnModuleDestroy
} from './module.interface';

export type OnMainModuleEvents = OnModuleDestroy<Promise<void>> &
    OnModuleInit<Promise<void>> &
    OnModuleAfterInit<Promise<void>>;

export type AppGetModuleChildEvents = {
    [K in keyof OnMainModuleEvents]: ((
        ...args: Parameters<OnMainModuleEvents[K]>
    ) => ReturnType<OnMainModuleEvents[K]>)[];
};
