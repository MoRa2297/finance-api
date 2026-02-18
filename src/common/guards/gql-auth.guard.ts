import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    handleRequest<TUser = any>(
        err: any,
        user: TUser,
        info: any,
    ): TUser {
        if (err || !user) {
            throw err ?? new UnauthorizedException('Invalid or expired token');
        }
        return user;
    }
}
