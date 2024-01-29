import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// Logged In Guard
export class LoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //get the request
    const request = context.switchToHttp().getRequest();

    // return TRUE if user exists.
    return request?.user;
  }
}
