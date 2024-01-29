import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { bcrypt } from 'bcrypt';
import { Register_UserDto } from '../dtos/register_user.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  //DI
  constructor(private userService: UsersService) {}

  // register
  async register(userInfo: Register_UserDto) {
    //duplicated Email
    const duplicatedEmailUser = await this.userService.findByEmail(
      userInfo.email,
    );
    if (duplicatedEmailUser)
      throw new BadRequestException(
        ' there is already an account with this email',
      );

    //duplicated Username
    const duplicatedUsername = await this.userService.findByUsername(
      userInfo.username,
    );
    if (duplicatedUsername)
      throw new BadRequestException(
        ' there is already an account with this username',
      );

    // pass hashing
    const DbPassword = await bcrypt.hash(userInfo.password, 8);

    userInfo.password = DbPassword;

    //return user
    return await this.userService.create(userInfo);
  }

  //login
  async login(email: string, password: string) {
    //check user existence
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('wrong username or password');

    // check password
    const savedPassword = user.password;
    const result = await bcrypt.compare(password, savedPassword);
    if (!result) throw new BadRequestException('wrong username or password');

    return user;
  }
}
