import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  // before handling req interceptor
  //intercept method
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //get the request
    const request = context.switchToHttp().getRequest();

    // get the date in string
    const date = new Date().toLocaleString();

    // log incoming req in format (date-method-origin-path)
    console.log(
      `${date}\t${request.method}\t${request.headers.origin}${request.path}`,
    );
    return next.handle();
  }
}
