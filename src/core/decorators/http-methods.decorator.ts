import { Reflection } from './../reflection';
import { RouteRequestMethodsEnum } from './../enums/route.enum';

/**
 * Factory function to create method decorators
 * @param httpMethod - HTTP method
 * @returns MethodDecorator
 * For example:
 * ```typescript
 * @Get('/post')
 * public getPost...
 * ```
 */
const makeMethodDecorator = (httpMethod: RouteRequestMethodsEnum) => {
	return (path = ''): MethodDecorator => {
		return (target, propertyKey, description: any) => {
			const controllerMethod = target.constructor;
			const methodName = String(propertyKey);
			const version = Reflection.getVersionPath(description.value);
			const routers = Reflection.getRoutes(controllerMethod);

			routers.push({
				httpMethod,
				path,
				methodName,
				version
			});
			Reflection.setRoutes(controllerMethod, routers);

			return description;
		};
	};
};

export const Get = makeMethodDecorator(RouteRequestMethodsEnum.GET);
export const Post = makeMethodDecorator(RouteRequestMethodsEnum.POST);
export const Put = makeMethodDecorator(RouteRequestMethodsEnum.PUT);
export const Delete = makeMethodDecorator(RouteRequestMethodsEnum.DELETE);
export const Patch = makeMethodDecorator(RouteRequestMethodsEnum.PATCH);
