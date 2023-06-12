import { Reflection } from './../reflection';
import { Request, Response, NextFunction } from 'express';

/**
 * Bypasses authentication middleware
 * @returns MethodDecorator
 *
 * For example:
 * ```typescript
 * @Use(AuthMiddleware)
 * @Controller('/post')
 * export class PostController {
 *      @AllowAnonymous()
 *      @Get('/post')
 *          public getPost() {
 *      }
 * }
 * ```
 */
export const AllowAnonymous = (): MethodDecorator => {
	return function (target) {
		const controller = target.constructor;
		const incomingMessages = Reflection.getIncomingMessages(controller);
		const handler = (
			req: Request & { allowAnonymous: boolean },
			_res: Response,
			next: NextFunction
		) => {
			req.allowAnonymous = true;
			next();
		};

		Reflection.setIncomingMessages(controller, [
			...incomingMessages,
			handler
		]);
	};
};
