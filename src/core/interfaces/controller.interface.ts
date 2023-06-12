import { RouteRequestMethodsEnum } from './../enums';

export interface ControllerRouter {
	httpMethod: RouteRequestMethodsEnum;
	path: string;
	methodName: string;
	version: string;
}
