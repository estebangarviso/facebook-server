// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
import { ConstantsEnum } from './../enums';
import { ParamData, PipeTransform, Type } from './../interfaces';
export const isUndefined = (val: any): val is undefined => val === undefined;
export const isNil = (val: any): val is null =>
	isUndefined(val) || val === null;
export const isObject = <T = object>(fn: any): fn is T =>
	!isNil(fn) && typeof fn === 'object';
export const isArray = <T = any>(val: any): val is T[] =>
	!isNil(val) && Array.isArray(val);
export const isSymbol = (val: any): val is symbol => typeof val === 'symbol';
export const isString = (val: any): val is string => typeof val === 'string';
export const isWritable = (obj: any, prop: string | symbol): boolean => {
	const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

	return Boolean(descriptor?.writable);
};
export const isFunction = (val: any): val is Function =>
	typeof val === 'function' &&
	!isUndefined(val.name) &&
	!isWritable(val, 'name');
export const isClass = (val: any): val is Type<any> =>
	typeof val === 'function' &&
	!!val.prototype &&
	!isUndefined(val.prototype.constructor.name) &&
	!isWritable(val.prototype.constructor, 'name') &&
	val.toString().slice(0, 5) === 'class';
export const isController = (val: any): val is Type<any> =>
	isClass(val) && Reflect.hasMetadata(ConstantsEnum.BASE_PATH, val);
export function assignMetadata<TParamtype = any, TArgs = any>(
	args: TArgs,
	paramtype: TParamtype,
	index: number,
	data?: ParamData,
	...pipes: (Type<PipeTransform> | PipeTransform)[]
) {
	return Object.assign(Object.assign({}, args), {
		[`${paramtype}:${index}`]: {
			index,
			data,
			pipes
		}
	});
}
