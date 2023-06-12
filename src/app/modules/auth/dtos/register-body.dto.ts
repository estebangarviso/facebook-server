import { CUSTOM_REGEX, HttpErrorMessages, UserGenderEnums } from '@shared';
import { BadRequestException } from '@core/exceptions';
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	MaxLength,
	Matches,
	IsDate,
	isNumberString,
	IsOptional,
	IsEnum
} from 'class-validator';
import { ApiModelProperty, ApiModel } from 'swagger-express-ts';
@ApiModel({
	description: 'Data transfer object for user registration'
})
export class RegisterBodyDto {
	@ApiModelProperty({
		description: 'User first name',
		required: true,
		example: 'John'
	})
	@Matches(CUSTOM_REGEX.NAME, {
		message: HttpErrorMessages.INVALID_MATCH_NAME.replace(
			'{s1}',
			'Firstname'
		)
	})
	@IsNotEmpty({ message: 'First name is required' })
	firstName: string;

	@ApiModelProperty({
		description: 'User last name',
		required: true,
		example: 'Doe'
	})
	@Matches(CUSTOM_REGEX.NAME, {
		message: HttpErrorMessages.INVALID_MATCH_NAME.replace(
			'{s1}',
			'Lastname'
		)
	})
	@IsNotEmpty({ message: 'Last name is required' })
	lastName: string;

	@ApiModelProperty({
		description: 'User email',
		required: true,
		example: 'johndoe@email.com'
	})
	@Matches(CUSTOM_REGEX.EMAIL, {
		message: 'Email is not valid'
	})
	@IsEmail(undefined, { message: 'Invalid email' })
	@MaxLength(320, { message: 'Email is too long' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@ApiModelProperty({
		description: 'User phone number)',
		example: '+11234567890'
	})
	@MaxLength(16, { message: 'Phone number only contains 16 characters' })
	@IsOptional()
	phone?: string;

	@ApiModelProperty({
		description: 'User date of birth (YYYY-MM-DD)',
		required: true,
		example: '1990-01-01'
	})
	@IsDate({ message: HttpErrorMessages.INVALID_DATE })
	@IsNotEmpty({ message: 'Date of birth is required' })
	@Transform(({ value }) => {
		if (isNumberString(value)) {
			const date = new Date(+value);
			const now = new Date();

			if (date > now)
				throw new BadRequestException(HttpErrorMessages.INVALID_DATE);
		}

		throw new BadRequestException(HttpErrorMessages.INVALID_DATE);
	})
	@IsNotEmpty({ message: 'Date of birth is required' })
	dateOfBirth: Date;

	@ApiModelProperty({
		description: 'User gender',
		enum: Object.values(UserGenderEnums),
		example: UserGenderEnums.MALE
	})
	@IsEnum(UserGenderEnums, {
		message: `Gender must be one of the following values: ${Object.values(
			UserGenderEnums
		).join(', ')}`
	})
	@IsOptional()
	gender?: UserGenderEnums;

	@ApiModelProperty({
		description: 'User password',
		required: true,
		example: 'Example@123'
	})
	@Matches(CUSTOM_REGEX.PASSWORD, {
		message: HttpErrorMessages.INVALID_MATCH_PASSWORD
	})
	@IsNotEmpty({ message: 'Password is required' })
	password: string;
}
