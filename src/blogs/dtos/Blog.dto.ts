import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class Author {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;
}

export class BlogDto {
  @ApiProperty({
    description: 'id of the blog',
    example: 12,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'title of the blog',
    example: 'blog',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'content of the blog',
    example: 'TEXT',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'tags of the blog',
    example: 'tag',
  })
  @Expose()
  tags: string;

  @ApiProperty({
    description: 'publishDate of the blog',
    example: '12-12-2002',
  })
  @Expose()
  publishDate: Date;

  @ApiProperty({
    description: 'author of the blog',
    example: {},
  })
  @Expose()
  @Type(() => Author)
  author: Author;
}
