import { assignMetadata } from '@core/utils';
import { Router } from 'express';

export interface RouteFactory {
    basePath: string;
    router: Router;
}

export type ParamData = object | string | number;
export type AssignedMetadata<TParamtype = any> = ReturnType<typeof assignMetadata<TParamtype>>;
