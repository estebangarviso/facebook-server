import { Reflection } from './../reflection';

/**
 * Function to create controller decorator
 * @param path - Path to controller
 * @returns ClassDecorator
 * For example:
 * ```typescript
 * @Controller('/post')
 * export class PostController {}
 * ```
 */
export const Controller = (basePath: string): ClassDecorator => {
	return (target) => {
		Reflection.setBasePath(target, basePath);
	};
};
