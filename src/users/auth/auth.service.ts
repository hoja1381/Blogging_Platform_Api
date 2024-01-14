import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { bcrypt } from 'bcrypt';
import { Register_UserDto } from '../dtos/register_user.dto';
import { error } from 'console';
import { Hash } from 'crypto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(userInfo: Register_UserDto) {
    
    const duplicatedEmailUser = await this.userService.findByEmail(
      userInfo.email,
    );
    if (duplicatedEmailUser)
      throw new BadRequestException(
        ' there is already an account with this email',
      );
    const duplicatedUsername = await this.userService.findByUsername(
      userInfo.username,
    );
    if (duplicatedUsername)
      throw new BadRequestException(
        ' there is already an account with this username',
      );

    const DbPassword = await bcrypt.hash(userInfo.password, 8);

    userInfo.password = DbPassword;

    return await this.userService.create(userInfo);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException('wrong username or password');

    const savedPassword = user.password;

    const result = await bcrypt.compare(password, savedPassword);

    if (!result) throw new BadRequestException('wrong username or password');

    return user;
  }
}
