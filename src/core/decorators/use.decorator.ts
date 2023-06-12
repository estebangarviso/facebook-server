import { InternalServerErrorException } from './../exceptions';
import { Reflection } from './../reflection';
import { RequestHandler } from 'express';

/**
 * Decorator to handle middlewares in a controller endpoints or a single endpoint
 * each middleware will be executed in the order they are defined
 * @param handlers - Express request handlers
 * @returns MethodDecorator | ClassDecorator
 * For example:
 * @Use(AuthMiddleware())
 * @Use(AuthMiddleware(), LoggerMiddleware()) // AuthMiddleware will be executed first
 */
export const Use = (...handlers: RequestHandler[]) => {
	if (!handlers || !handlers?.length) {
		throw new InternalServerErrorException(
			'Decorator requires at least one middleware'
		);
	}
	if (!handlers.every((handler) => typeof handler === 'function')) {
		throw new InternalServerErrorException(
			'Decorator requires RequestHandler as argument'
		);
	}

	return (target: any, propertyKey?: string | symbol, descriptor?: any) => {
		if (propertyKey)
			return onMethod(handlers)(target, propertyKey, descriptor);

		return onController(handlers)(target);
	};
};

const onController: (handlers: RequestHandler[]) => ClassDecorator = (
	handlers
) => {
	return (target) => {
		const controllerMiddlewares =
			Reflection.getControllerMiddlewares(target);

		Reflection.setControllerMiddlewares(target, [
			...controllerMiddlewares,
			...handlers
		]);
	};
};

const onMethod: (handlers: RequestHandler[]) => MethodDecorator = (
	handlers
) => {
	return (target, propertyKey, descriptor) => {
		const controller = target.constructor;

		const httpMethod = String(propertyKey);
		const routeMiddlewares = Reflection.getRouteMiddlewares(
			controller,
			httpMethod
		);

		Reflection.setRouteMiddlewares(controller, httpMethod, [
			...routeMiddlewares,
			...handlers
		]);

		return descriptor;
	};
};
