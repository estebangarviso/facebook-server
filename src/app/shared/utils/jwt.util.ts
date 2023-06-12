import { isNil, isString } from '@core/utils';
import {
	CUSTOM_REGEX,
	JwtAccessTokenPayload,
	JwtRefreshTokenPayload,
	TokenTypes
} from './../';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Check if the payload is an access token payload
 * @param payload
 */
export function isAccessTokenPayload(
	payload: JwtPayload | string
): payload is JwtAccessTokenPayload {
	if (isString(payload)) return false;
	const props = [payload.sub, payload.jti, payload.info, payload.roles];

	return (
		payload.type === TokenTypes.ACCESS &&
		props.every((prop) => !isNil(prop))
	);
}

/**
 * Check if the payload is a refresh token payload
 * @param payload
 * @returns {payload is JwtRefreshTokenPayload}
 */
export function isRefreshTokenPayload(
	payload: JwtPayload | string
): payload is JwtRefreshTokenPayload {
	if (isString(payload)) return false;
	const props = [payload.sub, payload.jti, payload.roles];

	return (
		payload.type === TokenTypes.REFRESH &&
		props.every((prop) => !isNil(prop))
	);
}

/**
 * Check if string is a valid Bearer token
 * @param token
 * @returns {token is BearerToken}
 */
export function isBearerToken(token: any): token is BearerToken {
	return isString(token) && CUSTOM_REGEX.BEARER_TOKEN.test(token);
}
