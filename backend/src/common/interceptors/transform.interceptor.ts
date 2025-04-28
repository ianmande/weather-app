import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T = unknown> {
  data: T;
  statusCode: number;
  success: boolean;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result: T | undefined | null) => {
        if (result === undefined || result === null) {
          const statusCode = res.statusCode || 200;
          res.status(statusCode);

          return {
            data: null as unknown as T,
            statusCode,
            success: statusCode < 400,
            message: statusCode === 204 ? 'No Content' : 'OK',
          };
        }

        const partial = result as Partial<{
          data: T;
          statusCode: number;
          message: string;
        }>;

        const statusCode = partial.statusCode ?? res.statusCode ?? 200;
        const message = partial.message ?? 'OK';

        res.status(statusCode);

        return {
          data: partial.data ?? result,
          statusCode,
          success: statusCode < 400,
          message: message,
        };
      }),
    );
  }
}
