import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class Update_UserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(3, 20)
  @IsOptional()
  username: string;

  @IsString()
  @Length(5, 40)
  @IsOptional()
  fullName: string;
}
