import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Update_blogDto {
  @ApiProperty({
    description: 'title of the blog',
    example: 'blog1',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'content of the blog',
    example: 'blogging test api',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'tags of the blog',
    example: 'coding',
  })
  @IsString()
  @IsOptional()
  tags: string;
}
