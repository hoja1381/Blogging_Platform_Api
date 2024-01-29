import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  //content
  @IsString()
  @ApiProperty({
    description: 'the content of the comment.',
    example: 'hi good content.',
  })
  content: string;
}
