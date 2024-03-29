import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class Login_UserDto {
  //email
  @ApiProperty({
    description: 'enter the email to login',
    example: 'h@g.com',
  })
  @IsEmail()
  email: string;

  //password
  @ApiProperty({
    description: 'enter the password to login',
    example: 'exp1234',
  })
  @IsString()
  password: string;
}
