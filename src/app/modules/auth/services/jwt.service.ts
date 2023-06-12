import { Injectable } from '@core/decorators';
import { RedisProvider } from '@providers/redis';
import { UserDocument } from '@providers/mongoose/models';
import { env } from '@config';
import jwt from 'jsonwebtoken';
import {
	ACCESS_EXPIRATION,
	JwtAccessTokenPayload,
	HttpErrorMessages,
	isAccessTokenPayload,
	isRefreshTokenPayload,
	JwtUser,
	REFRESH_EXPIRATION,
	JwtRefreshTokenPayload,
	TokenTypes
} from '@shared';
import { uuid } from '@core/utils';
import { RefreshBodyDto } from './../dtos/refresh-body.dto';
import { BadRequestException, UnauthorizedException } from '@core/exceptions';

const RP = 'jwt:r:';
const AP = 'jwt:a:';

@Injectable()
export class JwtService {
	constructor(private readonly cache: RedisProvider) {}

	/**
	 * Sign a payload and return a token
	 * @param user User to be signed
	 * @returns {SignedTokens}
	 */
	public signTokens(user: UserDocument | JwtUser): SignedTokens {
		const accessTokenPayload: JwtAccessTokenPayload = {
			type: TokenTypes.ACCESS,
			jti: uuid(),
			aud: env.APP.AUDIENCE,
			iss: env.APP.ISSUER,
			sub: user.id,
			info: {
				id: user.id,
				profilePicture: user.profilePicture,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
				dateOfBirth: user.dateOfBirth,
				gender: user.gender,
				active: user.active
			},
			roles: user.roles
		} as JwtAccessTokenPayload;

		const refreshTokenPayload: JwtRefreshTokenPayload = {
			type: TokenTypes.REFRESH,
			jti: uuid(),
			aud: env.APP.AUDIENCE,
			iss: env.APP.ISSUER,
			sub: user.id
		} as JwtRefreshTokenPayload;

		const [access_token, refresh_token] = [
			jwt.sign(accessTokenPayload, env.API.ACCESS_TOKEN.SECRET, {
				expiresIn: ACCESS_EXPIRATION
			}),
			jwt.sign(refreshTokenPayload, env.API.REFRESH_TOKEN.SECRET, {
				expiresIn: REFRESH_EXPIRATION
			})
		];
		this.cache.set(
			`${RP}${user.id}`,
			refresh_token,
			this.calculateExpirationTimeEpoch(REFRESH_EXPIRATION)
		);

		return { access_token, refresh_token };
	}

	/**
	 * Renew tokens using a refresh token and an access token
	 * @param access_token
	 * @param refresh_token
	 * @returns {Promise<SignedTokens>}
	 */
	public async renew(
		access_token: string,
		renewTokenBodyDto: RefreshBodyDto
	): Promise<SignedTokens> {
		let accessPayload = await this.verifyAccess(access_token);
		const { refreshToken, newData } = renewTokenBodyDto;

		const refreshPayload = await this.verifyRefresh(refreshToken);
		if (accessPayload.sub !== refreshPayload.sub)
			throw new UnauthorizedException(HttpErrorMessages.INVALID_TOKEN);

		const hasNewData = newData ? Object.keys(newData).length > 0 : false;

		if (hasNewData) accessPayload = { ...accessPayload, ...newData };

		const user: JwtUser = {
			id: accessPayload.sub,
			profilePicture: accessPayload.info.profilePicture,
			firstName: accessPayload.info.firstName,
			lastName: accessPayload.info.lastName,
			email: accessPayload.info.email,
			phone: accessPayload.info.phone,
			dateOfBirth: accessPayload.info.dateOfBirth,
			gender: accessPayload.info.gender,
			active: accessPayload.info.active,
			roles: accessPayload.roles
		};

		return this.signTokens(user);
	}

	/**
	 * Destroy access token
	 * @param access_token Token to be invalidated
	 * @returns {Promise<void>}
	 */
	public async destroy(access_token: string): Promise<void> {
		const accessPayload = await this.verifyAccess(access_token);

		const { jti, exp: time } = accessPayload;
		if (!time)
			throw new BadRequestException(HttpErrorMessages.EXPIRATION_INVALID);

		const ttl = this.calculateExpirationTimeEpoch(-time);
		const now = this.calculateExpirationTimeEpoch();
		if (now > ttl) return;
		await this.cache.set(
			`${AP}${jti}`,
			env.API.ACCESS_TOKEN.BLACKLIST_KEY,
			ttl
		);
	}

	/**
	 * Check if a token is blacklisted
	 * @param jti Token to be checked
	 * @returns {Promise<boolean>}
	 */
	private async isBlacklisted(jti: string): Promise<boolean> {
		const tokenId = `${AP}${jti}`;
		const blacklistKey = await this.cache.get(tokenId);

		if (!blacklistKey) return false;
		if (
			blacklistKey &&
			blacklistKey !== env.API.ACCESS_TOKEN.BLACKLIST_KEY
		) {
			this.cache.del(tokenId);
			throw new UnauthorizedException(HttpErrorMessages.UNAUTHORIZED);
		}

		throw new BadRequestException(HttpErrorMessages.INVALID_TOKEN);
	}

	/**
	 * Verify an access token
	 * @param access_token
	 */
	private async verifyAccess(
		access_token: string
	): Promise<JwtAccessTokenPayload> {
		const payload = jwt.verify(access_token, env.API.ACCESS_TOKEN.SECRET);
		if (!isAccessTokenPayload(payload))
			throw new UnauthorizedException(HttpErrorMessages.INVALID_TOKEN);

		await this.isBlacklisted(payload.jti);

		return payload;
	}

	/**
	 * Verify a refresh token
	 * @param refresh_token
	 * @returns {Promise<JwtRefreshTokenPayload>}
	 */
	private async verifyRefresh(
		refresh_token: string
	): Promise<JwtRefreshTokenPayload> {
		const payload = jwt.verify(refresh_token, env.API.REFRESH_TOKEN.SECRET);
		if (!isRefreshTokenPayload(payload))
			throw new UnauthorizedException(HttpErrorMessages.INVALID_TOKEN);

		const stored = await this.cache.get(`${RP}${payload.sub}`);
		if (stored !== refresh_token)
			throw new UnauthorizedException(HttpErrorMessages.INVALID_TOKEN);

		return payload;
	}

	/**
	 * Calculate the expiration time epoch from token
	 * @param time Time in seconds
	 * @returns {Epoch} Epoch time
	 */
	private calculateExpirationTimeEpoch(time = 0): Epoch {
		return Math.trunc(Date.now() / 1000) + time;
	}
}
