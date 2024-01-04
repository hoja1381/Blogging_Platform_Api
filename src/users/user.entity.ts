import { Blog } from 'src/blogs/blog.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Comment } from 'src/comments/comments.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  fullName: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user_id)
  comments: Comment[];
}
