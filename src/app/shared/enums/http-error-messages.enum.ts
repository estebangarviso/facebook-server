export enum HttpErrorMessages {
	UNAUTHORIZED = 'You are not authorized to access this resource',
	USER_NOT_FOUND = 'User not found',
	USER_ALREADY_EXISTS = 'User already exists',
	EXPIRATION_INVALID = 'Expiration is invalid',
	ACCESS_TOKEN_EXPIRED = 'Access token has expired',
	REFRESH_TOKEN_EXPIRED = 'Refresh token has expired',
	EMAIL_IS_NOT_REGISTERED = "This email isn't registered",
	EMAIL_IS_USED = 'This email is already used',
	ALREADY_AUTH = 'You are already authenticated',
	INVALID_TOKEN = 'Invalid token',
	INVALID_DATE = 'Invalid date',
	INVALID_PASSWORD = 'Invalid password',
	INVALID_MATCH_NAME = '{s1} must be at least 2 characters long containing only letters, spaces and some special characters (\\-,.)',
	INVALID_MATCH_PASSWORD = 'Password must be at least 8 characters long, contain at least one number, one uppercase letter and one special character (@$!%*?&)'
}
