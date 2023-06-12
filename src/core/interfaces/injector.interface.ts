// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
import { Abstract } from './abstract.interface';
import { Type } from './type.interface';
export type InjectionToken =
    | string
    | symbol
    | Type<any>
    | Abstract<any>
    | Function;
