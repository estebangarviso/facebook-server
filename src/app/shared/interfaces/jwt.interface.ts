import {
	UserRoles,
	UserUpdatableFieldsWithoutPassword
} from '@providers/mongoose/models';
import { TokenTypes } from '../enums';
import { JwtPayload } from 'jsonwebtoken';
import { Active } from '@providers/mongoose/models/interfaces/common';

export interface JwtUser
	extends UserUpdatableFieldsWithoutPassword,
		UserRoles,
		Active {
	id: string;
}

export interface JwtMainPayload extends JwtPayload {
	aud: string;
	iss: string;
	sub: string;
	jti: string;
	// any other props
	[key: string]: object | string | number | undefined;
}

export interface JwtAccessTokenPayload extends JwtMainPayload, UserRoles {
	type: TokenTypes.ACCESS;
	info: Omit<JwtUser, 'roles'>;
}

export interface JwtRefreshTokenPayload extends JwtMainPayload {
	type: TokenTypes.REFRESH;
}
