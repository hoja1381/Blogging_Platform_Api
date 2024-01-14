import { IsEmail, IsString, Max, Min } from 'class-validator';

export class Register_UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Max(20)
  @Min(3)
  username: string;

  @IsString()
  @Max(40)
  @Min(5)
  fullName: string;
}
