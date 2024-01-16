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
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  tags: string;

  @Expose()
  publishDate: Date;

  @Expose()
  @Type(() => Author)
  author: Author;
}
