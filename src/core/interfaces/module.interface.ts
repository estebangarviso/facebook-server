// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
import { Type } from './type.interface';
import { DynamicModule } from './dynamic-module.interface';
import { Provider } from './provider.interface';
import { Abstract } from './abstract.interface';
import { Server as HttpServer } from 'http';

/**
 * Interface defining the property object that describes the module.
 */
export interface ModuleMetadata {

    /**
     * Optional list of imported modules that export the providers which are
     * required in this module.
     */
    imports?: (Type<any> | DynamicModule | Promise<DynamicModule>)[];

    /**
     * Optional list of providers that will be instantiated by the Nest injector
     * and that may be shared at least across this module.
     */
    providers?: Provider[];

    /**
     * Optional list of controllers defined in this module which have to be
     * instantiated.
     */
    controllers?: Type<any>[];

    /**
     * Optional list of the subset of providers that are provided by this module
     * and should be available in other modules which import this module.
     */
    exports?: (
        | DynamicModule
        | Promise<DynamicModule>
        | Provider
        | Abstract<any>
    )[];
}

export type ModuleSet = string;

export interface OnModuleInit<R = any> {
    onModuleInit(): R;
}
export interface OnModuleAfterInit<R = any> {
    onModuleAfterInit(server: HttpServer): R;
}
export interface OnModuleDestroy<R = any> {
    onModuleDestroy(): R;
}
