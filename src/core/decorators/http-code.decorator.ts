import { RequestHandler } from 'express';
import { Reflection } from './../reflection';

/**
 * Request method Decorator.  Defines the HTTP response status code.  Overrides
 * default status code for the decorated request method.
 *
 * @param statusCode HTTP response code to be returned by route handler.
 */
export function HttpCode(statusCode: number): MethodDecorator {
	return function (target, _propertyKey, descriptor) {
		Reflection.setHttpCode(
			target,
			statusCode,
			descriptor.value as RequestHandler
		);

		return descriptor;
	};
}
