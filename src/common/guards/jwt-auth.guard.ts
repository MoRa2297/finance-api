import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
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
