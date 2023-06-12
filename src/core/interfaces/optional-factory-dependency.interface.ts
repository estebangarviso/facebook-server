import { InjectionToken } from './injector.interface';
export type OptionalFactoryDependency = {
    token: InjectionToken;
    optional: boolean;
};
