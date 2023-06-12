/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
import { Abstract, Provider, Type } from './interfaces';
import { Logger } from './services';
import { Reflection } from './reflection';
import { isClass, isFunction, isString, isSymbol, isController } from './utils';
import { nanoid } from 'nanoid';
import { InternalServerErrorException } from './exceptions';

export class Injector {
	constructor(
		private readonly _isGlobal: boolean = false,
		private readonly _container: Map<string, any> = new Map<string, any>()
	) {
		this._scopeName = _isGlobal ? 'global' : 'local';
	}

	public async resolve<T = any>(
		target: Type<T> | Function
	): Promise<T | Function> {
		const token = this.getToken(target);
		if (globalInjector.container.has(token))
			return globalInjector.container.get(token);
		if (this._container.has(token)) return this._container.get(token);

		const paramTypes = Reflection.getDesignParamTypes(target);
		const injections = await Promise.all(
			paramTypes.map(
				async (paramType: Type<any>) => await this.resolve(paramType)
			)
		);

		if (isFunction(target)) {
			this._container.set(token, target);

			return target;
		}

		const instance = new (target as Type<T>)(...injections);
		this._container.set(token, instance);
		Logger.info(`[${this._scopeName}] ${token} has been resolved`);

		return instance;
	}

	public async resolveModule(module: Type<any>): Promise<void> {
		await this.resolve(module);
	}

	public async addProvider(provider: Provider): Promise<void> {
		await this.resolve(provider);
	}

	public async addExport(exported: Type<any> | Abstract<any>): Promise<void> {
		const token = this.getToken(exported);

		// move to global scope
		if (globalInjector.container.has(token)) {
			throw new InternalServerErrorException(
				`You are trying to export ${token} more than once in the same scope (${this._scopeName})`
			);
		}
		await globalInjector.resolve(exported);
	}

	public async addImport(imported: Type<any>): Promise<void> {
		await this.resolve(imported);
	}

	public async addController(controller: Type<any>): Promise<void> {
		await this.resolve(controller);
	}

	public getControllers(): Type<any>[] {
		const children = this.childInjectors.map((childInjector) => {
			return {
				[childInjector.scopeName]: childInjector.container
			};
		});
		const controllers = new Set<Type<any>>();
		let containers: Record<string, Map<string, any>> = {
			global: globalInjector.container,
			local: this._container
		};

		if (children.length > 0)
			containers = Object.assign(containers, ...children);

		for (const [scope, container] of Object.entries(containers)) {
			for (const [token, instance] of container.entries()) {
				if (isController(instance)) {
					controllers.add(instance);

					Logger.info(
						`[${scope}] ${token} has been added to controllers`
					);
				}
			}
		}

		return [...controllers];
	}

	public getToken(
		prospect: symbol | string | Type<any> | Function | Abstract<any>
	): string {
		let token = Reflection.getIdentifier(prospect);
		if (token) return token;
		if (isClass(prospect)) {
			return prospect.constructor.name === 'Function'
				? prospect.prototype.constructor.name
				: prospect.constructor.name;
		} else if (isFunction(prospect)) {
			return prospect.name;
		} else if (isSymbol(prospect)) {
			return prospect.toString();
		} else if (isString(prospect)) {
			return prospect;
		}

		token = nanoid();

		Reflection.setIdentifier(token, prospect);

		return token;
	}

	public set module(module: Type<any>) {
		this._module = module;
		this._scopeName = module.name;
	}

	public get module(): Type<any> {
		return this._module;
	}

	public set childModule(module: Type<any>) {
		if (this._childInjectorNames.has(module)) {
			throw new InternalServerErrorException(
				`You are trying to add ${module} more than once in the same scope (${this._scopeName})`
			);
		}

		this._childInjectorNames.add(module);
	}

	public get scopeName(): string {
		return this._scopeName;
	}

	public get childInjectors(): Injector[] {
		const children = [...this._childInjectorNames.values()];

		return children.map((child) => {
			return Reflection.getModuleInjector(child);
		});
	}

	public get container(): Map<string, any> {
		return this._container;
	}

	private _module: Type<any>;

	private _scopeName: string;

	private _childInjectorNames = new Set<Type<any>>();
}
export const globalInjector = new Injector(true);
