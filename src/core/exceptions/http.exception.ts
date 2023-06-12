import { isObject, isString } from './../utils';
export class HttpException extends Error {
	private readonly response: string | Record<string, any>;

	private readonly status: number;

	/**
	 * Instantiate a plain HTTP Exception.
	 *
	 * @example
	 * `throw new HttpException()`
	 *
	 * @usageNotes
	 * The constructor arguments define the response and the HTTP response status code.
	 * - The `response` argument (required) defines the JSON response body.
	 * - The `status` argument (required) defines the HTTP Status Code.
	 *
	 * By default, the JSON response body contains two properties:
	 * - `statusCode`: the Http Status Code.
	 * - `message`: a short description of the HTTP error by default; override this
	 * by supplying a string in the `response` parameter.
	 *
	 * To override the entire JSON response body, pass an object to the `createBody`
	 * method. Nest will serialize the object and return it as the JSON response body.
	 *
	 * The `status` argument is required, and should be a valid HTTP status code.
	 * Best practice is to use the `HttpStatus` enum imported from `nestjs/common`.
	 *
	 * @param response string or object describing the error condition.
	 * @param status HTTP response status code.
	 */
	constructor(response: string | Record<string, any>, status: number) {
		super();
		this.response = response;
		this.status = status;
		this.initMessage();
		this.initName();
	}

	public initMessage() {
		if (isString(this.response)) {
			this.message = this.response;
		} else if (
			isObject<Record<string, any>>(this.response) &&
			isString(this.response?.message)
		) {
			this.message = this.response.message;
		} else if (this.constructor) {
			this.message = (this.constructor as any).name
				.match(/[A-Z][a-z]+|\d+/g)
				.join(' ');
		}
	}

	public initName() {
		this.name = this.constructor.name;
	}

	public getResponse() {
		return this.response;
	}

	public getStatus() {
		return this.status;
	}

	public static createBody(
		objectOrError: object | string,
		description?: string,
		statusCode?: number
	): object {
		if (!objectOrError) return { statusCode, message: description };

		return isObject(objectOrError) && !Array.isArray(objectOrError)
			? objectOrError
			: { statusCode, message: objectOrError, error: description };
	}
}
