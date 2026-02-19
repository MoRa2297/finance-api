import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtPayload {
    sub: number;
    iat?: number;
    exp?: number;
}

export interface CurrentUserPayload {
    id: number;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): CurrentUserPayload => {
        const contextType = context.getType<'http' | 'graphql'>();

        if (contextType === 'graphql') {
            const ctx = GqlExecutionContext.create(context);
            return ctx.getContext().req.user as CurrentUserPayload;
        }

        const request = context.switchToHttp().getRequest();
        return request.user as CurrentUserPayload;
    },
);
