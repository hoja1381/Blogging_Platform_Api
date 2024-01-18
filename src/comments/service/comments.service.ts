import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dtos/create_commnt.dto';
import { User } from '../../users/user.entity';
import { Blog } from '../../blogs/blog.entity';
import { UpdateCommentDto } from '../dtos/update_comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

  async create(body: CreateCommentDto, blog: Blog, user: User) {
    let newComment = this.repo.create(body);

    newComment.user = user;
    newComment.blog = blog;
    newComment.date = new Date();
    return await this.repo.save(newComment);
  }

  async update(id: number, body: UpdateCommentDto) {
    if (!id || !Object.keys(body).length) return null;

    const comment = await this.getById(id);
    if (!comment) throw new NotFoundException('comment not found');

    await this.repo.update({ id: id }, body);

    return await this.getById(id);
  }

  async delete(id: number) {
    const comment = await this.getById(id);

    if (!comment) {
      throw new NotFoundException('there is no comment with that id.');
    }

    return await this.repo.remove(comment);
  }

  async getById(id: number) {
    return await this.repo.findOne({ where: { id: id } });
  }

  async getAllCommentsOfUser(user: User) {
    return await this.repo.find({
      where: { user: user },
      relations: { blog: true },
    });
  }

  async getAllCommentsOfBlog(blog: Blog) {
    return await this.repo.find({ where: { blog: blog } });
  }
}
