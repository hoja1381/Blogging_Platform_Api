import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class Author {
  //id
  @Expose()
  id: number;

  //username
  @Expose()
  username: string;

  //fullName
  @Expose()
  fullName: string;
}

export class BlogDto {
  //id
  @ApiProperty({
    description: 'id of the blog',
    example: 12,
  })
  @Expose()
  id: number;

  //title
  @ApiProperty({
    description: 'title of the blog',
    example: 'blog',
  })
  @Expose()
  title: string;

  //content
  @ApiProperty({
    description: 'content of the blog',
    example: 'TEXT',
  })
  @Expose()
  content: string;

  //tags
  @ApiProperty({
    description: 'tags of the blog',
    example: 'tag',
  })
  @Expose()
  tags: string;

  //publishDate
  @ApiProperty({
    description: 'publishDate of the blog',
    example: '12-12-2002',
  })
  @Expose()
  publishDate: Date;

  //author
  @ApiProperty({
    description: 'author of the blog',
    example: {},
  })
  @Expose()
  @Type(() => Author)
  author: Author;
}
