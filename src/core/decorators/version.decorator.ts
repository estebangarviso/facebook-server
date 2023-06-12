import { Reflection } from '@core/reflection';

/**
 * Decorator for versioning API routes
 * @param version - Version of API
 * @returns MethodDecorator
 * For example:
 * ```typescript
 * @Controller('/post')
 * export class PostController {
 *     @Version('v2')
 *     @Get('/post')
 *    public getPost() {}
 * }
 * ```
 */
export const Version = (version: string): MethodDecorator => {
    return (target, propertyKey, description: any) => {
        Reflection.setVersionPath(description.value, version);

        return description;
    };
};
