/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-prototype-builtins */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
import { RequestHandler, Request, Response, NextFunction } from 'express';
import {
	ConstantsEnum,
	ModuleMetadataEnum,
	RouteParamtypesEnum
} from './enums';
import {
	ControllerRouter,
	DynamicModule,
	ModuleMetadata,
	AppGetModuleChildEvents,
	Type,
	OnModuleInit,
	OnModuleDestroy,
	OnModuleAfterInit,
	AssignedMetadata
} from './interfaces';
import { globalInjector, Injector } from './injector';
import { assignMetadata, isNil, isUndefined } from './utils';
import { InternalServerErrorException } from './exceptions';
export class Reflection {
	static setRouteArguments(
		constructor: any,
		args: any,
		paramtype: RouteParamtypesEnum,
		index: number,
		data: any,
		key?: string | symbol
	) {
		if (isUndefined(key)) return;

		Reflect.defineMetadata(
			ConstantsEnum.ROUTE_ARGS_METADATA,
			assignMetadata<RouteParamtypesEnum>(args, paramtype, index, data),
			constructor,
			key
		);
	}

	static getRouteArguments(
		constructor: any,
		key?: string | symbol
	): AssignedMetadata<RouteParamtypesEnum> {
		if (isUndefined(key)) return undefined;

		return (
			Reflect.getMetadata(
				ConstantsEnum.ROUTE_ARGS_METADATA,
				constructor,
				key
			) || {}
		);
	}

	static setModuleMetadata(
		module: Type<any>,
		metadata: ModuleMetadata
	): void {
		for (const property in metadata) {
			if (metadata.hasOwnProperty(property)) {
				Reflect.defineMetadata(
					property,
					metadata[property as keyof ModuleMetadata],
					module
				);
			}
		}
	}

	static getModuleMetadata(
		module: Type<any> | DynamicModule
	): ModuleMetadata | undefined {
		this.isDynamicModule(module) && (module = module.module);
		const imports =
			(Reflect.getMetadata(
				ModuleMetadataEnum.IMPORTS,
				module
			) as ModuleMetadata['imports']) || [];
		const controllers =
			(Reflect.getMetadata(
				ModuleMetadataEnum.CONTROLLERS,
				module
			) as ModuleMetadata['controllers']) || [];
		const providers =
			(Reflect.getMetadata(
				ModuleMetadataEnum.PROVIDERS,
				module
			) as ModuleMetadata['providers']) || [];
		const exports =
			(Reflect.getMetadata(
				ModuleMetadataEnum.EXPORTS,
				module
			) as ModuleMetadata['exports']) || [];
		if (
			imports.length === 0 &&
			controllers.length === 0 &&
			providers.length === 0 &&
			exports.length === 0
		)
			return undefined;

		return {
			imports,
			controllers,
			providers,
			exports
		};
	}

	static getModuleEvents(module: any): AppGetModuleChildEvents {
		const childEvents: AppGetModuleChildEvents = {
			onModuleInit: [],
			onModuleAfterInit: [],
			onModuleDestroy: []
		};
		const moduleMetadata = this.getModuleMetadata(module);
		if (!moduleMetadata) return childEvents;

		this.appendModuleEvents(module, childEvents); // module itself
		const childInjectors = this.getModuleInjector(
			module,
			false
		)?.childInjectors;
		if (!childInjectors) return childEvents;
		for (const childInjector of childInjectors)
			this.appendModuleEvents(childInjector.module, childEvents); // child modules

		return childEvents;
	}

	private static appendModuleEvents(
		module: any,
		events: AppGetModuleChildEvents
	): void {
		const hasOnModuleInit = (module: any): module is OnModuleInit => {
			return !isNil(module.onModuleInit);
		};
		const hasOnModuleAfterInit = (
			module: any
		): module is OnModuleAfterInit => {
			return !isNil(module.onModuleAfterInit);
		};
		const hasOnModuleDestroy = (module: any): module is OnModuleDestroy => {
			return !isNil(module.onModuleDestroy);
		};
		if (hasOnModuleAfterInit(module))
			events.onModuleAfterInit.push(module.onModuleAfterInit);

		if (hasOnModuleDestroy(module))
			events.onModuleDestroy.push(module.onModuleDestroy);

		if (hasOnModuleInit(module))
			events.onModuleInit.push(module.onModuleInit);
	}

	static async getModuleControllers(module: any): Promise<Type<any>[]> {
		const moduleInjector = this.getModuleInjector(module, false);
		if (!moduleInjector) return [];

		return await moduleInjector.getControllers();
	}

	static getModuleInjector<C extends boolean = true>(
		module: Type<any> | DynamicModule,
		createNew: C = true as C
	): C extends true ? Injector : Injector | undefined {
		let isGlobal = false;
		if (this.isDynamicModule(module)) {
			isGlobal = module.global || false;
			module = module.module;
		}

		if (isGlobal) return globalInjector;
		const injector: Injector = Reflect.getMetadata(
			ConstantsEnum.MODULE_LOCAL_SCOPE_METADATA,
			module
		);
		if (injector) return injector;
		if (createNew === false) return undefined as any;

		const moduleInjector = new Injector();
		moduleInjector.module = module;
		Reflect.defineMetadata(
			ConstantsEnum.MODULE_LOCAL_SCOPE_METADATA,
			moduleInjector,
			module
		);

		return moduleInjector;
	}

	/**
	 * Resolve module dependencies recursively. It means a module can import another module
	 * and that module can import another module and so on.
	 * @param module Module to resolve
	 */
	static async proccessDependencies(module: Type<any>): Promise<void> {
		const moduleMetadata = this.getModuleMetadata(module);
		if (!moduleMetadata) return;
		const moduleInjector = this.getModuleInjector(module);
		const {
			imports = [],
			controllers = [],
			providers = [],
			exports = []
		} = moduleMetadata;
		// Proccess module imports
		await this.proccessModuleImports(imports, moduleInjector);
		// Proccess module providers
		await this.proccessModuleProviders(providers, moduleInjector);
		// Process module controllers
		await this.proccessModuleControllers(controllers, moduleInjector);
		// Proccess module exports
		await this.proccessModuleExports(exports, moduleInjector);
		// Resolve module
		await moduleInjector.resolveModule(module);
	}

	private static async proccessModuleImports(
		imports: Required<ModuleMetadata['imports']> = [],
		moduleInjector: Injector
	): Promise<void> {
		await Promise.all(
			[...imports].map(async (_import) => {
				_import = await _import;
				if (this.isDynamicModule(_import))
					_import = await this.proccessDynamicModule(_import);

				const moduleMetadata = this.getModuleMetadata(_import);
				if (!moduleMetadata) moduleInjector.addImport(_import);

				await this.proccessModuleExports(
					moduleMetadata?.exports || [],
					moduleInjector
				); // this will add child module exports to global scope
				moduleInjector.childModule = _import;
				this.proccessDependencies(_import);
			})
		);
	}

	private static async proccessModuleProviders(
		providers: Required<ModuleMetadata['providers']> = [],
		moduleInjector: Injector
	): Promise<void> {
		for (const provider of providers)
			await moduleInjector.addProvider(provider);
	}

	private static async proccessModuleExports(
		exports: Required<ModuleMetadata['exports']> = [],
		moduleInjector: Injector
	): Promise<void> {
		for (let _export of exports) {
			_export = await _export;
			if (this.isDynamicModule(_export))
				_export = this.proccessDynamicModule(_export);

			await moduleInjector.addExport(_export);
		}
	}

	private static async proccessModuleControllers(
		controllers: Required<ModuleMetadata['controllers']> = [],
		moduleInjector: Injector
	): Promise<void> {
		for (const controller of controllers)
			await moduleInjector.addController(controller);
	}

	private static isDynamicModule(
		dynamicModule: any
	): dynamicModule is DynamicModule {
		return !!dynamicModule.module;
	}

	private static proccessDynamicModule(
		dynamicModule: DynamicModule
	): Type<any> {
		dynamicModule.global = isNil(dynamicModule.global)
			? false
			: this.isGlobalScope(dynamicModule.module);

		return dynamicModule.module;
	}

	static setGlobalScope(module: Type<any>): void {
		Reflect.defineMetadata(
			ConstantsEnum.MODULE_GLOBAL_SCOPE_METADATA,
			true,
			module
		);
	}

	static isGlobalScope(module: Type<any>): boolean {
		if (this.isDynamicModule(module) && module.global === true) return true;

		return (
			Reflect.getMetadata(
				ConstantsEnum.MODULE_GLOBAL_SCOPE_METADATA,
				module
			) || false
		);
	}

	static getIncomingMessages<R = Request>(
		controller: Function
	): Array<(req: R, res: Response, next: NextFunction) => void> {
		return (
			Reflect.getMetadata(
				ConstantsEnum.INCOMING_MESSAGES_METADATA,
				controller
			) || []
		);
	}

	static setBasePath(controller: Function, basePath: string): void {
		if (!basePath) return;
		Reflect.defineMetadata(ConstantsEnum.BASE_PATH, basePath, controller);
	}

	static setIncomingMessages<R = Request>(
		controller: Function,
		incomingMessages: Array<
			(req: R, res: Response, next: NextFunction) => void
		>
	): void {
		if (incomingMessages.length === 0) return;
		Reflect.defineMetadata(
			ConstantsEnum.INCOMING_MESSAGES_METADATA,
			incomingMessages,
			controller
		);
	}

	static getControllerMiddlewares(controller: Function): RequestHandler[] {
		return (
			Reflect.getMetadata(
				ConstantsEnum.USE_CONTROLLER_METADATA,
				controller
			) || []
		);
	}

	static setControllerMiddlewares(
		controller: Function,
		middlewares: RequestHandler[]
	): void {
		if (middlewares.length === 0) return;
		Reflect.defineMetadata(
			ConstantsEnum.USE_CONTROLLER_METADATA,
			middlewares,
			controller
		);
	}

	static getRouteMiddlewares(
		controller: Function,
		controllerMethod: string
	): RequestHandler[] {
		return (
			Reflect.getMetadata(
				ConstantsEnum.USE_METHOD_METADATA,
				controller,
				controllerMethod
			) || []
		);
	}

	static setRouteMiddlewares(
		controller: Function,
		controllerMethod: string,
		middlewares: RequestHandler[] | []
	): void {
		if (middlewares.length === 0) return;
		Reflect.defineMetadata(
			ConstantsEnum.USE_METHOD_METADATA,
			middlewares,
			controller,
			controllerMethod
		);
	}

	static getBasePath(controller: Function): string {
		return Reflect.getMetadata(ConstantsEnum.BASE_PATH, controller);
	}

	static getRoutes(controller: Function): ControllerRouter[] {
		return (
			Reflect.getMetadata(ConstantsEnum.ROUTERS_METADATA, controller) ||
			[]
		);
	}

	static setRoutes(controller: Function, routes: ControllerRouter[]): void {
		if (routes.length === 0) {
			throw new InternalServerErrorException(
				`${controller.name} has no routes`
			);
		}
		Reflect.defineMetadata(
			ConstantsEnum.ROUTERS_METADATA,
			routes,
			controller
		);
	}

	static getVersionPath(controllerMethod?: Function): string {
		if (!controllerMethod) return 'v1';

		return (
			Reflect.getMetadata(
				ConstantsEnum.ROUTE_VERSION_METADATA,
				controllerMethod
			) || 'v1'
		);
	}

	static setVersionPath(
		controllerMethod: Function,
		versionPath: string
	): void {
		Reflect.defineMetadata(
			ConstantsEnum.ROUTE_VERSION_METADATA,
			versionPath,
			controllerMethod
		);
	}

	static getDesignParamTypes(target: Type<any> | Function): Type<any>[] {
		return Reflect.getMetadata(ConstantsEnum.PARAMTYPES_METADATA, target);
	}

	static setInjectable(injectable: Type<any>): void {
		const isInjectable =
			Reflect.getMetadata(
				ConstantsEnum.INJECTABLE_METADATA,
				injectable
			) || false;
		if (isInjectable) {
			throw new InternalServerErrorException(
				`${injectable.name} is already injectable`
			);
		}
		Reflect.defineMetadata(
			ConstantsEnum.INJECTABLE_METADATA,
			true,
			injectable
		);
	}

	static setInject(targetClass: any, key: string | symbol, property: any) {
		const isInjectable =
			Reflect.getMetadata(
				ConstantsEnum.INJECTABLE_METADATA,
				targetClass,
				key
			) || false;
		if (isInjectable) {
			throw new InternalServerErrorException(
				`${String(key)} is already injected`
			);
		}
		Reflect.defineMetadata(
			ConstantsEnum.INJECTABLE_METADATA,
			property,
			targetClass,
			key
		);
	}

	static setIdentifier(token: string, target: any): void {
		Reflect.defineMetadata(
			ConstantsEnum.IDENTIFIER_METADATA,
			token,
			target
		);
	}

	static getIdentifier(target: any): string | undefined {
		return Reflect.getMetadata(ConstantsEnum.IDENTIFIER_METADATA, target);
	}

	static setHttpCode(
		target: any,
		statusCode: number,
		reqHandler: RequestHandler
	): void {
		Reflect.defineMetadata(
			ConstantsEnum.HTTP_CODE_METADATA,
			statusCode,
			reqHandler
		);
	}

	static getHttpCode(reqHandler: RequestHandler): number | undefined {
		return Reflect.getMetadata(
			ConstantsEnum.HTTP_CODE_METADATA,
			reqHandler
		);
	}
}
