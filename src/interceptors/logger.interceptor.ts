import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    // 요청 로깅
    this.logger.log(
      `Request: ${method} ${url} - Body: ${JSON.stringify(body)}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        // 응답 로깅
        this.logger.log(
          `Response: ${method} ${url} - Status: ${statusCode} - ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
