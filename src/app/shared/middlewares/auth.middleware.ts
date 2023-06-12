import { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@config';
import { UnauthorizedException, ForbiddenException } from '@core/exceptions';
import { HttpErrorMessages, UserRoleEnums } from './../enums';
import {
	JwtAccessTokenPayload,
	isAccessTokenPayload,
	isBearerToken
} from '@shared';
import { UserUpdatableFieldsWithoutPassword } from '@providers/mongoose/models';
import {} from '@core/utils';

export interface AuthenticatedRequest extends Request {
	allowAnonymous?: boolean;
	headers: {
		userId?: string;
		userRoles?: UserRoleEnums[];
		userInfo?: UserUpdatableFieldsWithoutPassword;
	} & Request['headers'];
}

/**
 * Middleware to check access control based on ABAC and RBAC
 */
export const AccessControlMiddleware: RequestHandler = (
	req: AuthenticatedRequest,
	res,
	next
) => {
	if (req.allowAnonymous) return next();
	const cookieToken = req.cookies.token;
	const authorization = req.headers.authorization;

	if (!cookieToken || !isBearerToken(authorization))
		throw new UnauthorizedException();

	const access_token = cookieToken || authorization?.toString().split(' ')[1];
	try {
		const payload = jwt.verify(
			access_token,
			env.API.ACCESS_TOKEN.SECRET
		) as JwtAccessTokenPayload;
		if (!isAccessTokenPayload(payload))
			throw new UnauthorizedException(HttpErrorMessages.INVALID_TOKEN);

		req.headers.userId = payload.sub;
		req.headers.userRoles = payload.roles;
		req.headers.userInfo = payload.info;
		next();
	} catch {
		// clear cookie if invalid token
		res.clearCookie('token');
		throw new UnauthorizedException(HttpErrorMessages.INVALID_TOKEN);
	}
};

/**
 * Middleware to check if the user is not authorized
 */
export const NotAuthorizedMiddleware: RequestHandler = (
	req: AuthenticatedRequest,
	_res,
	next
) => {
	// if already authorized, throw forbidden exception
	if (req.headers.userId)
		throw new ForbiddenException(HttpErrorMessages.ALREADY_AUTH);

	next();
};
