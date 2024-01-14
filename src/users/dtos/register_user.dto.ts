import { IsEmail, IsString, Length, Max, Min } from 'class-validator';

export class Register_UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Length(3, 20)
  username: string;

  @IsString()
  @Length(3, 20)
  fullName: string;
}
