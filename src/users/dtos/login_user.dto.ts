import { IsEmail, IsString } from 'class-validator';

export class Login_UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
