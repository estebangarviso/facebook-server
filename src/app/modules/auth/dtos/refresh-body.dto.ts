import { ApiModelProperty } from 'swagger-express-ts';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserUpdatableFields } from '@providers/mongoose/models';

export class RefreshBodyDto {
	@ApiModelProperty({
		description: 'New user data',
		example: {
			firstName: 'John',
			lastName: 'Doe'
		},
		required: false
	})
	newData?: UserUpdatableFields;

	@ApiModelProperty({
		description: 'Refresh token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		required: true
	})
	@IsNotEmpty({ message: 'Refresh token is required' })
	@IsString({ message: 'Refresh token must be a string' })
	refreshToken: string;
}
