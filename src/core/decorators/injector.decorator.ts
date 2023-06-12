import { Reflection } from './../reflection';

/**
 * Function to make a class injectable
 * @returns ClassDecorator
 * For example:
 * import { Injectable } from './decorators';
 * @Injectable()
 * export class SomeService {...}
 * --------------------------
 * import { SomeService } from './post.service';
 * @Controller()
 * export class PostController {
 *  constructor(private SomeService: SomeService) {...}
 * }
 */
export function Injectable(): ClassDecorator {
	return function (target: any): void {
		Reflection.setInjectable(target);
	};
}

/**
 * Function to inject a class into another class
 * @param target Class to inject
 * @returns PropertyDecorator
 * For example:
 * import { Inject } from './decorators';
 * @Injectable()
 * export class SomeService {
 *  constructor(@Inject(NonInjectableClass) private readonly nonInjectableClass: NonInjectableClass) {...}
 * }
 */
export function Inject(target: any): PropertyDecorator {
	return function (targetClass: any, key): void {
		Reflection.setInject(targetClass, key, target);
	};
}
