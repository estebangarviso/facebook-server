import express from 'express';
import { Server as HTTPServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import ms from 'ms';
import * as swagger from 'swagger-express-ts';
import { Env, env, schema } from './env';
import { MaintenanceMiddleware } from './middlewares';
import { Reflection } from './reflection';
import { routeFactory } from './factories';
import { NotFoundException, InternalServerErrorException } from './exceptions';
import { Inject, Injectable } from './decorators';
import {
	AppGetModuleChildEvents,
	RouteFactory,
	Type,
	OnMainModuleEvents
} from './interfaces';
import { MemoryStore, rateLimit } from 'express-rate-limit';
import { Logger } from './services';
import { ISwaggerBuildDefinition } from 'swagger-express-ts/swagger.builder';

@Injectable()
export default class App {
	@Inject(express) private readonly _app: express.Express;

	constructor(private mainModule: OnMainModuleEvents) {
		this.appendEvents();
	}

	/**
	 * Enable Rate Limit for all routes
	 * @param windowMs How long we should remember the requests. Defaults to 15 minutes.
	 * @param max Max number of connections during windowMs milliseconds before sending a 429 response. Defaults to 100.
	 */
	public enableRateLimit(windowMs = 15 * 60 * 1000, max = 100) {
		const time = ms(windowMs, { long: true });
		this._app.use(
			rateLimit({
				store: new MemoryStore(),
				windowMs,
				max,
				message: `Too many requests from this IP, please try again after ${time}`,
				standardHeaders: true,
				handler: (req, res, next, options) =>
					res.status(options.statusCode).json({
						success: false,
						message: options.message
					})
			})
		);
	}

	/**
	 * Enable Swagger UI
	 * @param title Title of the API
	 * @param version of the API
	 * @param description Description of the API
	 * @param path Optional path of resource. Default is "/api/swagger.json".
	 */
	public enableSwagger(
		definition: ISwaggerBuildDefinition,
		path = '/api/swagger.json'
	) {
		this._app.use(
			swagger.express({
				path,
				definition
			})
		);
	}

	public static async create(mainModule: Type<any>) {
		await new Env().addEnv(env, schema).verifyEnv;
		if (!mainModule)
			throw new InternalServerErrorException('Main module is required');
		const module = new mainModule();

		const app = new this(module);

		try {
			// Resolve module dependencies
			Logger.info('Processing module dependencies...');
			await Reflection.proccessDependencies(module);
			Logger.success('Module dependencies processed.');

			// Resolve module routes
			Logger.info('Processing module routes...');
			await app.appendRoutes();
			Logger.success('Module routes processed.');

			return app;
		} catch (error) {
			await app.shutdown();
			throw error;
		}
	}

	public async listen() {
		this.init();

		await Promise.all(this._events.onModuleInit);

		this._server = this._app.listen(env.PORT);

		await Promise.all(
			this._events.onModuleAfterInit.map(async (event) => {
				await event(this._server as HTTPServer);
			})
		);

		return this._server;
	}

	public async shutdown() {
		Logger.warn('Application is shutting down...');

		await Promise.all(this._events.onModuleDestroy);

		return this._server?.close();
	}

	private init() {
		// Settings
		this._app.set('trust proxy', true);
		this._app.set('host', env.HOSTNAME);
		this._app.set('port', env.PORT);
		this._app.disable('x-powered-by');

		// Middlewares
		this._app.use(cookieParser());
		this._app.use(helmet());
		this._app.use(
			morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined')
		);
		this._app.use(
			cors({
				origin: env.CORS_ORIGIN_WHITELIST,
				credentials: true
			})
		);
		this._app.use(express.urlencoded({ extended: true }));
		this._app.use(express.json());
		this._app.use(express.static(env.PUBLIC_DIR));
		this._app.use(MaintenanceMiddleware);

		// Routes
		this.applyRoutes();
	}

	private applyRoutes() {
		// Check duplicate routes
		const routes = this._routes.map((route) => route.basePath);
		const duplicates = routes.filter(
			(route, index) => routes.indexOf(route) !== index
		);
		if (duplicates.length > 0) {
			throw new InternalServerErrorException(
				`Duplicate routes found: ${duplicates.join(', ')}`
			);
		}
		// Routes
		for (const route of this._routes)
			this._app.use(`${env.BASE_PATH}${route.basePath}`, route.router);

		// Favicon handler
		this._app.get('/favicon.ico', (_req, res) => res.status(204));

		// Handling 404 error
		this._app.use((_req, _res, next) => {
			next(new NotFoundException('Not found'));
		});
		// Middleware that handles errors
		this._app.use(
			(
				error: TypeError & { status: number },
				_req: express.Request,
				res: express.Response,
				next: express.NextFunction
			) => {
				Logger.error(error);
				const status = error.status || 500;
				const message = error.message || 'Internal server error';

				res.status(status).send({ error, message });
				next();
			}
		);
	}

	private appendEvents() {
		this._events = Reflection.getModuleEvents(this.mainModule);
	}

	private async appendRoutes() {
		const controllers = await Reflection.getModuleControllers(
			this.mainModule
		);
		this._routes = controllers.map((controller) => {
			return routeFactory(controller);
		});
	}

	private _server?: HTTPServer;

	private _events: AppGetModuleChildEvents;

	private _routes: RouteFactory[] = [];

	set events(events: AppGetModuleChildEvents) {
		this._events = events;
	}
}
