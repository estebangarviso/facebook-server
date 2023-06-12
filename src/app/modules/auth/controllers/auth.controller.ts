import { Response } from 'express';
import { UserCreateIncoming } from '@providers/mongoose/models';
import {
	AllowAnonymous,
	Controller,
	Get,
	HttpCode,
	Post,
	Use,
	Body,
	UploadedFile,
	Headers,
	Res
} from '@core/decorators';
import { rateLimit } from 'express-rate-limit';
import { AccessControlMiddleware, NotAuthorizedMiddleware } from '@shared';
import { AuthService } from './../services/';
import { HttpStatus } from '@core/enums';
import { Logger } from '@core/services';
import { LoginBodyDto } from './../dtos/login-body.dto';
import { RegisterBodyDto } from './../dtos/register-body.dto';
import { RefreshBodyDto } from './../dtos/refresh-body.dto';
import { LogoutHeadersDto } from './../dtos/logout-headers.dto';
import { UnauthorizedException } from '@core/exceptions';

@Use(AccessControlMiddleware)
@Controller('/auth')
export class AuthController {
	constructor(
		private readonly _logger: Logger,
		private readonly _service: AuthService
	) {}

	@Use(
		NotAuthorizedMiddleware,
		rateLimit({
			windowMs: 60 * 60 * 1000, // 1 hour window
			max: 5, // start blocking after 5 requests
			message:
				'Too many requests from this IP, please try again after an hour'
		})
	)
	@AllowAnonymous()
	@Post('/login')
	async login(@Body() body: LoginBodyDto) {
		const { email, password } = body;

		return await this._service.login(email, password);
	}

	@Use(
		NotAuthorizedMiddleware,
		rateLimit({
			windowMs: 60 * 60 * 1000, // 1 hour window
			max: 100, // limit each IP to 100 requests per windowMs
			message:
				'Too many requests from this IP, please try again after an hour'
		})
	)
	@AllowAnonymous()
	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	async register(
		@Body() body: RegisterBodyDto,
		@UploadedFile('profilePicture') profilePicture?: Express.Multer.File
	) {
		const createUser: UserCreateIncoming = {
			profilePicture,
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			password: body.password,
			dateOfBirth: body.dateOfBirth,
			gender: body.gender,
			phone: body.phone
		};

		return await this._service.register(createUser);
	}

	@AllowAnonymous()
	@Get('/refresh')
	async refresh(
		@Headers('Authorization') authorization: string,
		@Body() body: RefreshBodyDto
	) {
		const access_token = authorization?.toString().split(' ')[1];

		try {
			if (!access_token)
				throw new UnauthorizedException('No token provided');

			return await this._service.refresh(access_token, body);
		} catch (error) {
			this._logger.error(error);

			throw error;
		}
	}

	@Get('/logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Headers() headers: LogoutHeadersDto, @Res() res: Response) {
		try {
			const { authorization } = headers;

			await this._service.logout(authorization);

			// clear cookie on client
			res.clearCookie('access_token');

			return;
		} catch (error) {
			this._logger.error(error);

			throw error;
		}
	}
}
