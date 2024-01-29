import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BlogDto } from '../../blogs/dtos/Blog.dto';

export class UserDto {
  //id
  @ApiProperty({
    description: 'an unique generated Id by the DB',
    example: 5,
  })
  @Expose()
  id: number;

  //email
  @ApiProperty({
    description: 'the user email that is used to create the acc.',
    example: 'h@g.com',
  })
  @Expose()
  email: string;

  //username
  @ApiProperty({
    description: 'the username that is used to create the acc.',
    example: 'hoja',
  })
  @Expose()
  username: string;

  //fullName
  @ApiProperty({
    description: 'the fullName of the user.',
    example: 'hossein jahandide',
  })
  @Expose()
  fullName: string;

  //isAdmin
  @ApiProperty({
    description:
      'the isAdmin property shows if a user is admin or not. it is false bu default',
    example: false,
  })
  @Expose()
  isAdmin: boolean;

  //blogs
  @ApiProperty({
    description: 'shows the user blogs.',
    example: [],
  })
  @Expose()
  @Type(() => BlogDto)
  blogs: BlogDto[];
}
