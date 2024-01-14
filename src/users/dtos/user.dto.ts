import { Expose } from 'class-transformer';
import { Blog } from 'src/blogs/blog.entity';
import { Comment } from 'src/comments/comments.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  fullName: string;

  @Expose()
  isAdmin: boolean;

  @Expose()
  blogs: Blog[];

  @Expose()
  comments: Comment[];
}
