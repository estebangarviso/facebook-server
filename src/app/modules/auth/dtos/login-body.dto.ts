import { IsEmail, IsString, Matches } from 'class-validator';
import { CUSTOM_REGEX } from '@shared';
import { ApiModelProperty, ApiModel } from 'swagger-express-ts';

@ApiModel({
	description: 'Data transfer object for user login'
})
export class LoginBodyDto {
	@ApiModelProperty({
		description: 'User email',
		required: true
	})
	@Matches(CUSTOM_REGEX.EMAIL, {
		message: 'Email is not valid'
	})
	@IsEmail(
		{
			allow_display_name: true
		},
		{ message: 'Invalid email' }
	)
	email: string;

	@ApiModelProperty({
		description: 'User password',
		required: true
	})
	@Matches(CUSTOM_REGEX.PASSWORD, {
		message:
			'Password must be at least 8 characters long, contain at least one number, one uppercase letter and one special character (@$!%*?&)'
	})
	@IsString({ message: 'Invalid password' })
	password: string;
}
