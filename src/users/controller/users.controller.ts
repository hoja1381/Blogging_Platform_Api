import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { AuthService } from '../auth/auth.service';
import { Register_UserDto } from '../dtos/register_user.dto';
import { Login_UserDto } from '../dtos/login_user.dto';
import { request } from 'https';
import { CurrentUser } from 'src/decorators/current_user.decorator';
const jwt = require('jsonwebtoken');
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/')
  async register(@Body() body: Register_UserDto, @Session() session: any) {
    const newUser = await this.authService.register(body);

    const accessToken = jwt.sign(
      {
        id: newUser.id,
        isAdmin: newUser.isAdmin,
        email: newUser.email,
        username: newUser.username,
      },
      process.env.JWT_KEY, // replace with .env later
      { expiresIn: '6h' },
    );

    session.accessToken = accessToken;

    return newUser;
  }

  @Post('/login')
  async login(@Body() body: Login_UserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_KEY, // replace with .env later
      { expiresIn: '6h' },
    );

    session.accessToken = accessToken;

    return user;
  }

  @Get('/getme')
  getMe(@CurrentUser() user) {
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('you are not registered or logged in.');
    }
  }
}
