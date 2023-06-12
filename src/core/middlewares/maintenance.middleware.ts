import { RequestHandler } from 'express';
import { env } from './../env';
import { ServiceUnavailableException } from '@core/exceptions';

/**
 * Middleware to check if the server is under maintenance
 */
export const MaintenanceMiddleware: RequestHandler = (req, res, next) => {
	if (
		env.MAINTENANCE.MODE &&
		!env.MAINTENANCE.WHITELIST_IPS.includes(req.ip)
	) {
		throw new ServiceUnavailableException(
			'Service unavailable, please try again later'
		);
	}
	next();
};
