import { Reflection } from './../reflection';

/**
 * Function to assing global scope to a module
 * @param module Module
 * @returns ClassDecorator
 * For example:
 * import { Module, Global } from './decorators';
 * @Global()
 * @Module({...})
 * export class AppModule {...}
 */
export function Global(): ClassDecorator {
	return function (target: any) {
		// Set module options
		Reflection.setGlobalScope(target);
	};
}
