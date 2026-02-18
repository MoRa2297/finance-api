import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtPayload {
    id: number;
    email: string;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): JwtPayload => {
        const contextType = context.getType<'http' | 'graphql'>();

        if (contextType === 'graphql') {
            const ctx = GqlExecutionContext.create(context);
            return ctx.getContext().req.user;
        }

        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);
