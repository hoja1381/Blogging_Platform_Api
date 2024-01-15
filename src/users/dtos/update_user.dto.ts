import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class Update_UserDto {
  @ApiProperty({
    description: 'enter an email. it must be unique',
    example: 'h@g.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description:
      'enter an username. it  must be min 3 and max 20 characters long',
    example: 'h@g.com',
  })
  @IsString()
  @Length(3, 20)
  @IsOptional()
  username: string;

  @ApiProperty({
    description:
      'enter an fullName. it  must be min 5 and max 50 characters long',
    example: 'h@g.com',
  })
  @IsString()
  @Length(5, 40)
  @IsOptional()
  fullName: string;
}
