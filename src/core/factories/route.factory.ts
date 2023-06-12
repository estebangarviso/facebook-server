import { RequestHandler, Router } from 'express';
import { Reflection } from './../reflection';
import { RouteFactory } from './../interfaces';
import { Logger } from './../services';
export const routeFactory = function (controller: any): RouteFactory {
	const router = Router();
	const basePath: string = Reflection.getBasePath(controller);
	const routes = Reflection.getRoutes(controller);
	const incomingMessages = Reflection.getIncomingMessages(controller);
	const controllerMiddlewares =
		Reflection.getControllerMiddlewares(controller);

	if (incomingMessages.length > 0) router.use(incomingMessages);
	if (controllerMiddlewares.length > 0) router.use(controllerMiddlewares);

	const tableData: any[] = [];

	tableData.push(['Method', 'Path', 'Handler']);
	for (const { httpMethod, path, methodName, version } of routes) {
		// Bind the controller instance to the handler
		const controllerMethodPropertyKey = String(methodName);
		const controllerMethod = controller[controllerMethodPropertyKey].bind(
			controller
		) as any;
		// Get response code
		const decoratedHttpCode = Reflection.getHttpCode(controllerMethod);
		const routeMiddlewares = Reflection.getRouteMiddlewares(
			controller,
			controllerMethodPropertyKey
		);
		if (decoratedHttpCode) {
			router.use((req, res, next) => {
				res.status(decoratedHttpCode);
				next();
			});
		}

		const reqHandlers: RequestHandler[] = [];
		if (routeMiddlewares) reqHandlers.push(...routeMiddlewares);
		reqHandlers.push(controllerMethod);
		const cleanPath = path.startsWith('/') ? path : `/${path}`;
		const cleanVersion = version.startsWith('/') ? version : `/${version}`;
		router
			.route(`${cleanVersion}${cleanPath}`.replace(/\/\//g, '/'))
			[httpMethod](...reqHandlers);

		tableData.push([
			httpMethod.toUpperCase(),
			`${cleanVersion}${basePath ? basePath : ''}${cleanPath}`,
			controllerMethodPropertyKey
		]);
	}

	Logger.table(tableData);

	return { basePath, router };
};
