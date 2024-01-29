import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Update_blogDto {
  // title
  @ApiProperty({
    description: 'title of the blog',
    example: 'blog1',
  })
  @IsString()
  @IsOptional()
  title: string;

  //content
  @ApiProperty({
    description: 'content of the blog',
    example: 'blogging test api',
  })
  @IsString()
  @IsOptional()
  content: string;

  //tags
  @ApiProperty({
    description: 'tags of the blog',
    example: 'coding',
  })
  @IsString()
  @IsOptional()
  tags: string;
}
