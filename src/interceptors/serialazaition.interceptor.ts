import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';

//custom Class type
interface ClassConstructor {
  new (...arg: any[]): {};
}

// custom decorator for Serialize
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new serializeInterceptor(dto));
}

//after handling req interceptor for serialize
export class serializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  //intercept method
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // serialize
    return next.handle().pipe(
      map((data: object) => {
        // return exposed values in DTOs
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
