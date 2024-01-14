import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/service/users.service';
import { User } from 'src/users/user.entity';

const jwt = require('jsonwebtoken');

@Injectable()
export class VerifyToken implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: any, res: any, next: NextFunction) {
    const user_id = this.verifyToken(req, res, next);
    const user = await this.userService.findById(user_id);

    req.user = user;

    next();
  }

  verifyToken(req: any, res: any, next: NextFunction): string {
    const { accessToken } = req.session || {};

    if (accessToken) {
      // verify the TOKEN
      const user_id = jwt.verify(
        accessToken,
        process.env.JWT_key,
        (err, user) => {
          if (err) {
            throw new ForbiddenException(err);
          } else {
            return user.id;
          }
        },
      );
      return user_id;
    }
  }
}
