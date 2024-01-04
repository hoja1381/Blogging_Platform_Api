import { Blog } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user_id: User;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog_id: Comment;
}
