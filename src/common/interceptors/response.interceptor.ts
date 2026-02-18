import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    data: T;
    timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const contextType = context.getType<'http' | 'graphql'>();

        // GraphQL handles its own response format
        if (contextType === 'graphql') {
            return next.handle();
        }

        return next.handle().pipe(
            map((data) => ({
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
