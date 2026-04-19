import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  iat?: number;
  exp?: number;
}

export interface CurrentUserPayload {
  id: number;
}

interface RequestWithUser extends Request {
  user: CurrentUserPayload;
}

interface GqlContext {
  req: RequestWithUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserPayload => {
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext<GqlContext>().req.user;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
