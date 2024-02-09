import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/service/users.service';
import { ConfigService } from '@nestjs/config';

const jwt = require('jsonwebtoken');

@Injectable()
export class VerifyToken implements NestMiddleware {
  //DI
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  // USE func.
  async use(req: any, res: any, next: NextFunction) {
    // verify token and get the user
    const user_id = this.verifyToken(req, res, next);
    const user = await this.userService.findById(user_id);

    //set user in req
    req.user = user;

    next();
  }

  //verifyToken
  verifyToken(req: any, res: any, next: NextFunction): number {
    // get token from cookie session
    const { accessToken } = req.session || {};

    if (accessToken) {
      // verify the TOKEN
      const user_id = jwt.verify(
        accessToken,
        process.env.JWT_KEY,
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
