import { UserService, JwtService } from './';
import { Injectable } from '@core/decorators';
import { HttpErrorMessages } from '@shared';
import { UnauthorizedException, ConflictException } from '@core/exceptions';
import { UserCreateIncoming } from '@providers/mongoose/models';
import { RefreshBodyDto } from './../dtos/refresh-body.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	public async login(email: string, password: string) {
		const user = await this.userService.findByEmail(email);
		const isPasswordValid = this.userService.validatePassword(
			user.password,
			password
		);
		if (!isPasswordValid)
			throw new UnauthorizedException(HttpErrorMessages.INVALID_PASSWORD);

		return this.jwtService.signTokens(user);
	}

	public async register(user: UserCreateIncoming) {
		const isEmailRegistered = await this.userService.checkEmail(user.email);

		if (isEmailRegistered)
			throw new ConflictException(HttpErrorMessages.EMAIL_IS_USED);

		const doc = await this.userService.create(user);

		return this.jwtService.signTokens(doc);
	}

	public async refresh(access_token: string, renewTokenDto: RefreshBodyDto) {
		return await this.jwtService.renew(access_token, renewTokenDto);
	}

	public async logout(access_token: string) {
		await this.jwtService.destroy(access_token);
	}
}
