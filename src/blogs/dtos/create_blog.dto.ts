import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Create_blogDto {
  //title
  @ApiProperty({
    description: 'title of the blog',
    example: 'blog1',
  })
  @IsString()
  title: string;

  //content
  @ApiProperty({
    description: 'content of the blog',
    example: 'blogging test api',
  })
  @IsString()
  content: string;

  //tags
  @ApiProperty({
    description: 'tags of the blog',
    example: 'coding',
  })
  @IsString()
  tags: string;
}
