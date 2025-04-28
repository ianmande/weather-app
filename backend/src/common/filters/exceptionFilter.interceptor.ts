import {
  HttpException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}
@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Log the error with request details
    this.logger.error(
      `Error procesando ${req.method} ${req.url}: ${exception.message}`,
    );

    let message = 'Unknown error';
    let error = 'HttpException';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const data = exceptionResponse as ExceptionResponse;

      if (typeof data.message === 'string') {
        message = data.message;
      } else if (Array.isArray(data.message)) {
        message = data.message.join(', ');
      }

      error = data.error ?? error;
    }

    res.status(status).json({
      statusCode: status,
      success: false,
      data: null,
      message,
      error,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
