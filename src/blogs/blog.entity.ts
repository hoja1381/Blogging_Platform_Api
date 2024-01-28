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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @Column()
  tags: string;

  @Column()
  publishDate: Date;

  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Blog[];

  @AfterInsert()
  insertLogger() {
    console.log('blog ADDED  id=' + this.id + ' User=' + this.author.id);
  }
}
