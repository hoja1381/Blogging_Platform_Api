import { Blog } from '../blogs/blog.entity';
import {
  AfterInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../comments/comments.entity';

@Entity()
export class User {
  //id
  @PrimaryGeneratedColumn()
  id: number;

  //email
  @PrimaryColumn({ unique: true })
  email: string;

  //password
  @Column()
  password: string;

  //username
  @Column({ unique: true })
  username: string;

  //fullName
  @Column()
  fullName: string;

  //isAdmin
  @Column({ default: false })
  isAdmin: boolean;

  //blogs
  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  //comments
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  //insert Logger
  @AfterInsert()
  insertLogger() {
    console.log('user added to the db with id=' + this.id);
  }
}
