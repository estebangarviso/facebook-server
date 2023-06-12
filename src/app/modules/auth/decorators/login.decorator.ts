import { applyDecorators } from '@core/decorators';
import { ApiOperationPost } from 'swagger-express-ts';

export function LoginDecorator() {
    return applyDecorators(
        ApiOperationPost({
            description: 'Login',
            summary: 'It allows to an user login and returns a tokens',
            parameters: {
                body: {
                    description: 'Data for login',
                    required: true,
                    model: 'LoginBodyDto'
                }
            },
            responses: {
                200: {
                    description: 'Success',
                    type: 'LoginResponseDto'
                },
                400: { description: 'Bad Request' }
            }
        })
    );
}
