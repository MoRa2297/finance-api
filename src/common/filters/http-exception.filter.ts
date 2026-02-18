import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const contextType = host.getType<'http' | 'graphql'>();

        // GraphQL errors are handled differently — let them propagate
        if (contextType === 'graphql') {
            throw exception;
        }

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message:
                typeof message === 'string'
                    ? message
                    : (message as any).message ?? message,
        };

        if (status >= 500) {
            this.logger.error(
                `${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        response.status(status).json(errorResponse);
    }
}
