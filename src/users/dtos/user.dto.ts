import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Blog } from 'src/blogs/blog.entity';
import { Comment } from 'src/comments/comments.entity';

export class UserDto {
  @ApiProperty({
    description: 'an unique generated Id by the DB',
    example: 5,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'the user email that is used to create the acc.',
    example: 'h@g.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'the username that is used to create the acc.',
    example: 'hoja',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'the fullName of the user.',
    example: 'hossein jahandide',
  })
  @Expose()
  fullName: string;

  @ApiProperty({
    description:
      'the isAdmin property shows if a user is admin or not. it is false bu default',
    example: false,
  })
  @Expose()
  isAdmin: boolean;

  @ApiProperty({
    description: 'shows the user blogs.',
    example: [],
  })
  @Expose()
  blogs: Blog[];

  @ApiProperty({
    description: 'shows the user comments.',
    example: [],
  })
  @Expose()
  comments: Comment[];
}
