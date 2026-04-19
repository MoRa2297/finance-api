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
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    const contextType = context.getType<'http' | 'graphql'>();

    // GraphQL handles its own response format
    if (contextType === 'graphql') {
      return next.handle();
    }

    return next.handle().pipe(
      map(
        (data: T): ApiResponse<T> => ({
          data,
          timestamp: new Date().toISOString(),
        }),
      ),
    );
  }
}
