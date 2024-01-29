import { Blog } from '../blogs/blog.entity';
import { User } from '../users/user.entity';
import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  //id
  @PrimaryGeneratedColumn()
  id: number;

  //content
  @Column()
  content: string;

  //date
  @Column()
  date: Date;

  //user
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  //blog
  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  //insert Logger
  @AfterInsert()
  insertLogger() {
    console.log(
      'comment ADDED id=' +
        this.id +
        '  BLOG=' +
        this.blog.id +
        '  User=' +
        this.user.id,
    );
  }
}
