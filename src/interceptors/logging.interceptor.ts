import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const date = new Date().toLocaleString();
    console.log(
      `${date}\t${request.method}\t${request.headers.origin}${request.path}`,
    );
    return next.handle();
  }
}
