import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

//Admin Guard
export class AdminGuard implements CanActivate {
  //canActivate method
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //get the request
    const request = context.switchToHttp().getRequest();

    //return the admin value (boolean)
    return request.user?.isAdmin;
  }
}
