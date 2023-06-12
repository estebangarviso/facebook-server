import { Reflection } from './../reflection';
import { ModuleMetadata, ModuleSet } from './../interfaces/module.interface';
import { MODULE_METADATA, ModuleMetadataEnum } from './../enums';
import { isString, isUndefined } from './../utils';
import { InternalServerErrorException } from './../exceptions';
// eslint-disable-next-line @typescript-eslint/ban-types
const Modules = new Set<ModuleSet>();

/**
 * Function to create a module
 * @param options Module options
 * @returns ClassDecorator
 *
 * For example:
 * ```typescript
 * import { Module } from './decorators';
 * @Module({
 * imports: [PostModule],
 * controllers: [PostController],
 * providers: [PostService],
 * exports: [PostService]
 * })
 * export class AppModule {...}
 * --------------------------
 * import App from './app';
 * import { AppModule } from 'app.module';
 * async function bootstrap(): Promise<void> {
 *     const app = await App.create(AppModule);
 *
 *     await app.listen();
 * }
 * bootstrap();
 * ```
 */
export function Module(options: ModuleMetadata): ClassDecorator {
	const validate = (options: ModuleMetadata): void => {
		const keys = Object.keys(options);
		for (const key of keys) {
			if (!MODULE_METADATA.includes(key as ModuleMetadataEnum)) {
				throw new InternalServerErrorException(
					`Invalid property '${key}' passed into the @Module() decorator.`
				);
			}
		}
	};

	validate(options);

	return function (target: any) {
		// Set module as a controller
		if (isUndefined(target.name)) {
			throw new InternalServerErrorException(
				'Module must have a name. Please, rename it.'
			);
		}
		if (!isString(target.name)) {
			throw new InternalServerErrorException(
				'Module name must be a string.'
			);
		}
		if (Modules.has(target.name)) {
			throw new InternalServerErrorException(
				`Module name "${target.name}" must be unique. Please rename it.`
			);
		}
		Modules.add(target.name);
		// Set module options
		Reflection.setModuleMetadata(target, options);
	};
}
