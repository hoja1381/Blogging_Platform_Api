import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../service/users.service';
import { AuthService } from '../auth/auth.service';
import { Register_UserDto } from '../dtos/register_user.dto';
import { Login_UserDto } from '../dtos/login_user.dto';
import { CurrentUser } from '../../decorators/current_user.decorator';
import { Update_UserDto } from '../dtos/update_user.dto';
import { Serialize } from '../../interceptors/serialazaition.interceptor';
import { UserDto } from '../dtos/user.dto';
import { AdminGuard } from '../../guards/adminastor.guard';

import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const jwt = require('jsonwebtoken');

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  //DI
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Auth Routes

  // REGISTER
  @Post('/')

  //swagger
  @ApiOperation({
    summary: 'register user',
    description: 'register a new user to the api. and create a new user in DB',
    tags: ['auth'],
  })
  @ApiCookieAuth('session')
  @ApiCreatedResponse({
    description: 'return the created user from DB.',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'return BadRequest if the data is not allowed.',
  })

  //register
  async register(@Body() body: Register_UserDto, @Session() session: any) {
    const newUser = await this.authService.register(body);

    const accessToken = jwt.sign(
      {
        id: newUser.id,
      },
      this.configService.get('JWT_KEY'),
      { expiresIn: '6h' },
    );

    session.accessToken = accessToken;

    return newUser;
  }

  // LOGIN
  @Post('/login')

  //swagger
  @HttpCode(200)
  @ApiOperation({
    summary: 'login',
    description: 'login the user and return a jwt accessToken as cookie',
    tags: ['auth'],
  })
  @ApiCookieAuth('session')
  @ApiOkResponse({
    description: 'return a user json and jwt accessToken as cookie.',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'return BadRequest if email or password is not correct',
  })

  //login
  async login(@Body() body: Login_UserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    console.log(this.configService.get('JWT_KEY'));

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      this.configService.get('JWT_KEY'),
      { expiresIn: '6h' },
    );

    session.accessToken = accessToken;

    return user;
  }

  //LOGOUT
  @Post('/logout')
  @HttpCode(200)

  //swagger
  @ApiOperation({
    summary: 'logout',
    description: 'logout the user and clear the jwt accessToken from cookie',
    tags: ['auth'],
  })
  @ApiCookieAuth('session')
  @ApiOkResponse({
    description: 'clear the jwt accessToken from cookie',
  })
  @ApiInternalServerErrorResponse({
    description: 'if occur an err in deleting the cookie session',
  })

  //logout
  logout(@Session() session: any) {
    session.accessToken = null;

    return { massage: 'logged out' };
  }

  // User Routes

  //GETME
  @Get('/getme')

  //swagger
  @ApiOperation({
    summary: 'get me',
    description: 'get the current logged  in user and return it.',
    tags: ['user'],
  })
  @ApiCookieAuth('session')
  @ApiOkResponse({
    description: 'return a user json and jwt accessToken as cookie.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'return you are not registered or logged in. if there is no session cookie or its value is null.',
  })

  //getMe
  getMe(@CurrentUser() user) {
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('you are not registered or logged in.');
    }
  }

  // UPDATE USER
  @Put('/')

  //swagger
  @ApiOperation({
    summary: 'updateUser',
    description: 'get the current logged  in user and update it.',
    tags: ['user'],
  })
  @ApiCookieAuth('session')
  @ApiOkResponse({
    description: 'return a the updated user json.',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'return bad request err if the inputs is not valid',
  })
  @ApiUnauthorizedResponse({
    description:
      'return you are not registered or logged in. if there is no session cookie or it value is null.',
  })

  //update User
  async updateUser(@Body() body: Update_UserDto, @CurrentUser() user) {
    return await this.userService.update(user.id, body);
  }

  // DELETE USER
  @Delete('/')

  //swagger
  @ApiOperation({
    summary: 'deleteUser',
    description: 'get the current logged  in user and delete it.',
    tags: ['user'],
  })
  @ApiCookieAuth('session')
  @ApiOkResponse({
    description:
      'delete the logged in user. return null if no user is logged in.',
    type: UserDto,
  })

  //delete User
  async deleteUser(@CurrentUser() user) {
    await this.userService.delete(user?.id);

    return { massage: 'your account has been deleted' };
  }

  // Admin access

  //DELETE USERS BY ID BY ADMIN
  @Delete('/admin/:id')
  @UseGuards(AdminGuard)

  //swagger
  @ApiOperation({
    summary: 'delete user by admin ',
    description: 'delete the user with the given id By admin.',
    tags: ['admin'],
  })
  @ApiOkResponse({
    description: 'the user by the given id is deleted',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'return a not found if there is no user with the given id.',
  })

  //deleteUserById
  async deleteUserById(@Param('id') id: number) {
    return await this.userService.delete(id);
  }

  //GET USERS BY ID (ADMIN ACCESS)
  @Get('/admin/:id')
  @UseGuards(AdminGuard)
  @UseGuards(AdminGuard)

  //swagger
  @ApiOperation({
    summary: 'get user by admin ',
    description: 'get the user with the given id By admin.',
    tags: ['admin'],
  })
  @ApiOkResponse({
    description: 'return user by the given ',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'return a not found if there is no user with the given id.',
  })

  //getUserById
  async getUserById(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  // GET ALL USERS (ADMIN ACCESS)
  @Get('/')
  @UseGuards(AdminGuard)

  //swagger
  @ApiOperation({
    summary: 'get users by admin ',
    description: 'get the all user in the DB by Admin.',
    tags: ['admin'],
  })
  @ApiOkResponse({
    description: 'return users. return empty array if there is no user.',
    type: [UserDto],
  })

  //getAllUser
  async getAllUser() {
    return await this.userService.find();
  }

  //MAKE ADMIN
  @Post('/makeAdmin/:id')
  @UseGuards(AdminGuard)

  //swagger
  @ApiOperation({
    summary: 'make another user admin or not',
    description: 'change the user role by a given id and a query value.',
    tags: ['admin'],
  })
  @ApiOkResponse({
    description: 'return the user that is adjusted',
    type: [UserDto],
  })

  //makeAdmin
  async makeAdmin(@Param('id') id: number, @Query('isAdmin') isAdmin: boolean) {
    if (isAdmin) {
      return await this.userService.makeAdmin(id, isAdmin);
    }
    return await this.userService.makeAdmin(id, true);
  }
}
