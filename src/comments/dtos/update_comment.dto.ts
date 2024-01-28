import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @ApiProperty({
    description: 'the content of the comment.',
    example: 'hi good content.',
  })
  content: string;
}
