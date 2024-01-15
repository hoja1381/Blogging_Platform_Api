import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Max, Min } from 'class-validator';

export class Register_UserDto {
  @ApiProperty({
    description: 'enter an email. it must be unique',
    example: 'h@g.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'enter an password. it better be strong password',
    example: 'h@g.com',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description:
      'enter an username. it  must be min 3 and max 20 characters long',
    example: 'h@g.com',
  })
  @IsString()
  @Length(3, 20)
  username: string;

  @ApiProperty({
    description:
      'enter an fullName. it  must be min 5 and max 50 characters long',
    example: 'h@g.com',
  })
  @IsString()
  @Length(5, 50)
  fullName: string;
}
