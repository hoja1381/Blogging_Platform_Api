import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { AuthService } from '../auth/auth.service';
import { Register_UserDto } from '../dtos/register_user.dto';
import { Login_UserDto } from '../dtos/login_user.dto';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { Update_UserDto } from '../dtos/update_user.dto';
import { Serialize } from 'src/interceptors/serialazaition.interceptor';
import { UserDto } from '../dtos/user.dto';
import { AdminGuard } from 'src/guards/adminastor,guard';

const jwt = require('jsonwebtoken');

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // Auth Routes

  @Post('/')
  async register(@Body() body: Register_UserDto, @Session() session: any) {
    const newUser = await this.authService.register(body);

    const accessToken = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_KEY, // replace with .env later
      { expiresIn: '6h' },
    );

    session.accessToken = accessToken;

    return newUser;
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: Login_UserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_KEY, // replace with .env later
      { expiresIn: '6h' },
    );

    session.accessToken = accessToken;

    return user;
  }

  @Post('/logout')
  @HttpCode(200)
  logout(@Session() session: any) {
    session.accessToken = null;

    return { massage: 'logged out' };
  }

  @Get('/getme')
  getMe(@CurrentUser() user) {
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('you are not registered or logged in.');
    }
  }

  // Users Routes

  @Put('/')
  async updateUSer(@Body() body: Update_UserDto, @CurrentUser() user) {
    return await this.userService.update(user.id, body);
  }

  @Delete('/')
  async deleteUser(@CurrentUser() user) {
    await this.userService.delete(user.id);

    return { massage: 'your account has been deleted' };
  }

  // Admin access

  @Delete('/admin/:id')
  @UseGuards(AdminGuard)
  async deleteUserById(@Param('id') id: number) {
    return await this.userService.delete(id);
  }

  @Get('/:id')
  @UseGuards(AdminGuard)
  async getUserById(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  // @Get('/userByEmail/:email')
  // async getUserByEmail(@Param('email') email: string) {
  //   return await this.userService.findByEmail(email);
  // }

  @Get('/')
  @UseGuards(AdminGuard)
  async getAllUser() {
    return await this.userService.find();
  }
}
