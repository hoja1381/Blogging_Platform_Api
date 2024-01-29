import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  //content
  @IsString()
  @ApiProperty({
    description: 'the content of the comment.',
    example: 'hi good content.',
  })
  content: string;

  //blog_id
  @IsNumber()
  @ApiProperty({
    description: 'the blog_id of the comment.',
    example: 8,
  })
  blog_id: number;
}
