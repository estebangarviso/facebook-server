import { ConstantsEnum, RouteParamtypesEnum } from './../enums';
import { Type, PipeTransform } from './../interfaces';
import { Reflection } from './../reflection';
export interface ResponseDecoratorOptions {
	/**
	 * Determines whether the response will be sent manually within the route handler,
	 * with the use of native response handling methods exposed by the platform-specific response object,
	 * or if it should passthrough Nest response processing pipeline.
	 *
	 * @default false
	 */
	passthrough: boolean;
}
function createRouteParamDecorator(
	paramtype: RouteParamtypesEnum
): (
	data?: any,
	...pipes: (Type<PipeTransform> | PipeTransform)[]
) => ParameterDecorator {
	return (data) => (target, key, index) => {
		const args =
			Reflection.getRouteArguments(target.constructor, key) || {};
		Reflection.setRouteArguments(
			target.constructor,
			args,
			paramtype,
			index,
			data,
			key
		);
	};
}

/**
 * Route handler parameter decorator. Extracts the `Request`
 * object from the underlying platform and populates the decorated
 * parameter with the value of `Request`.
 *
 * Example: `logout(@Request() req)`
 */
export const Request = createRouteParamDecorator(RouteParamtypesEnum.REQUEST);

/**
 * Route handler parameter decorator. Extracts the `Response`
 * object from the underlying platform and populates the decorated
 * parameter with the value of `Response`.
 *
 * Example: `logout(@Response() res)`
 */
export const Response =
	(options?: ResponseDecoratorOptions): ParameterDecorator =>
	(target, key, index) => {
		if (
			options === null || options === void 0
				? void 0
				: options.passthrough
		) {
			Reflect.defineMetadata(
				ConstantsEnum.RESPONSE_PASSTHROUGH_METADATA,
				options === null || options === void 0
					? void 0
					: options.passthrough,
				target.constructor,
				key as string
			);
		}

		return createRouteParamDecorator(RouteParamtypesEnum.RESPONSE)()(
			target,
			key,
			index
		);
	};

/**
 * Route handler parameter decorator. Extracts reference to the `Next` function
 * from the underlying platform and populates the decorated
 * parameter with the value of `Next`.
 *
 * Example: `logout(@Next() next)`
 */
export const Next = createRouteParamDecorator(RouteParamtypesEnum.NEXT);

/**
 * Route handler parameter decorator. Extracts the `Ip` property
 * from the `req` object and populates the decorated
 * parameter with the value of `ip`.
 *
 * Example: `logout(@Ip() ip)`
 */
export const Ip = createRouteParamDecorator(RouteParamtypesEnum.IP);

/**
 * Route handler parameter decorator. Extracts the `Session` object
 * from the underlying platform and populates the decorated
 * parameter with the value of `Session`.
 * Example: `logout(@Session() session)`
 */
export const Session = createRouteParamDecorator(RouteParamtypesEnum.SESSION);

/**
 * Route handler parameter decorator. Extracts the `file` object
 * and populates the decorated parameter with the value of `file`.
 * Used in conjunction with
 * [multer middleware](https://github.com/expressjs/multer) for Express-based applications.
 *
 * For example:
 * ```typescript
 * uploadFile(@UploadedFile() file) {
 *   console.log(file);
 * }
 * ```
 */
export const UploadedFile = (fileKey: string, ...pipes: PipeTransform[]) => {
	return createRouteParamDecorator(RouteParamtypesEnum.FILE)(
		fileKey,
		...pipes
	);
};

/**
 * Route handler parameter decorator. Extracts the `files` object
 * and populates the decorated parameter with the value of `files`.
 * Used in conjunction with
 * [multer middleware](https://github.com/expressjs/multer) for Express-based applications.
 *
 * For example:
 * ```typescript
 * uploadFile(@UploadedFiles() files) {
 *   console.log(files);
 * }
 * ```
 */
export const UploadedFiles = (...pipes: PipeTransform[]) => {
	return createRouteParamDecorator(RouteParamtypesEnum.FILES)(
		undefined,
		...pipes
	);
};

/**
 * Route handler parameter decorator. Extracts the `headers`
 * property from the `req` object and populates the decorated
 * parameter with the value of `headers`.
 *
 * For example: `async update(@Headers('Cache-Control') cacheControl: string)`
 *
 * @param property name of single header property to extract.
 */
export const Headers = createRouteParamDecorator(RouteParamtypesEnum.HEADERS);

/**
 * Route handler parameter decorator. Extracts the `query`
 * property from the `req` object and populates the decorated
 * parameter with the value of `query`. May also apply pipes to the bound
 * query parameter.
 *
 * For example:
 * ```typescript
 * async find(@Query('user') user: string)
 * ```
 *
 * @param property name of single property to extract from the `query` object
 * @param pipes one or more pipes to apply to the bound query parameter
 */
export function Query(property: string, ...pipes: PipeTransform[]) {
	return createRouteParamDecorator(RouteParamtypesEnum.QUERY)(
		property,
		...pipes
	);
}

/**
 * Route handler parameter decorator. Extracts the entire `body` object
 * property, or optionally a named property of the `body` object, from
 * the `req` object and populates the decorated parameter with that value.
 * Also applies pipes to the bound body parameter.
 *
 * For example:
 * ```typescript
 * async create(@Body('role', new ValidationPipe()) role: string)
 * ```
 *
 * @param property name of single property to extract from the `body` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound body parameter.
 */
export function Body(property?: string, ...pipes: PipeTransform[]) {
	return createRouteParamDecorator(RouteParamtypesEnum.BODY)(
		property,
		...pipes
	);
}

/**
 * Route handler parameter decorator. Extracts the entire `body` object
 * property, or optionally a named property of the `body` object, from
 * the `req` object and populates the decorated parameter with that value.
 * Also applies pipes to the bound body parameter.
 *
 * For example:
 * ```typescript
 * async create(@Body('role', new ValidationPipe()) role: string)
 * ```
 *
 * @param property name of single property to extract from the `body` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound body param
 */
export function Param(property: string, ...pipes: PipeTransform[]) {
	return createRouteParamDecorator(RouteParamtypesEnum.PARAM)(
		property,
		...pipes
	);
}

/**
 * Route handler parameter decorator. Extracts the `hosts`
 * property from the `req` object and populates the decorated
 * parameter with the value of `params`. May also apply pipes to the bound
 * parameter.
 *
 * For example, extracting all params:
 * ```typescript
 * findOne(@HostParam() params: string[])
 * ```
 *
 * For example, extracting a single param:
 * ```typescript
 * findOne(@HostParam('id') id: string)
 * ```
 * @param property name of single property to extract from the `req` object
 */
export function HostParam(property?: string, ...pipes: PipeTransform[]) {
	return createRouteParamDecorator(RouteParamtypesEnum.HOST)(
		property,
		...pipes
	);
}

export const Req = Request;
export const Res = Response;
