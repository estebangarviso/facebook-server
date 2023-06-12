import { IsString, Matches } from 'class-validator';
import { CUSTOM_REGEX, HttpErrorMessages } from '@shared';
import { ApiModelProperty, ApiModel } from 'swagger-express-ts';

@ApiModel({
	description: 'Data transfer object for user logout'
})
export class LogoutHeadersDto {
	@ApiModelProperty({
		description: 'Authorization token',
		required: true,
		example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
	})
	@Matches(CUSTOM_REGEX.BEARER_TOKEN, {
		message: HttpErrorMessages.INVALID_TOKEN
	})
	@IsString({ message: HttpErrorMessages.INVALID_TOKEN })
	authorization: string;
}
