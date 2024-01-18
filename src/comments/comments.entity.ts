import { Blog } from '../blogs/blog.entity';
import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;
}
