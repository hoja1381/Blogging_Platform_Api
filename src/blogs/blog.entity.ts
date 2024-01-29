import { Comment } from '../comments/comments.entity';
import { User } from '../users/user.entity';
import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Blog {
  //id
  @PrimaryGeneratedColumn()
  id: number;

  //title
  @Column({ unique: true })
  title: string;

  //content
  @Column()
  content: string;

  //tags
  @Column()
  tags: string;

  //publishDate
  @Column()
  publishDate: Date;

  //author
  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  //comments
  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Blog[];

  //insertLogger
  @AfterInsert()
  insertLogger() {
    console.log('blog ADDED  id=' + this.id + ' User=' + this.author.id);
  }
}
