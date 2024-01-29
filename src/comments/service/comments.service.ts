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
  //DI
  constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

  //create
  async create(body: CreateCommentDto, blog: Blog, user: User) {
    // create Object
    let newComment = this.repo.create(body);

    //set values
    newComment.user = user;
    newComment.blog = blog;
    newComment.date = new Date();

    // save in DB and return
    return await this.repo.save(newComment);
  }

  //update
  async update(id: number, body: UpdateCommentDto) {
    //check id and body
    if (!id || !Object.keys(body).length) return null;

    //check the comment existence
    const comment = await this.getById(id);
    if (!comment) throw new NotFoundException('comment not found');

    // update ir // issue cant user (this.repo.save) for update ???
    await this.repo.update({ id: id }, body);

    // return updated
    return await this.getById(id);
  }

  //delete
  async delete(id: number) {
    //check the comment existence
    const comment = await this.getById(id);
    if (!comment) {
      throw new NotFoundException('there is no comment with that id.');
    }

    // delete and return
    return await this.repo.remove(comment);
  }

  //getById
  async getById(id: number) {
    return await this.repo.findOne({ where: { id: id } });
  }

  //get All Comments Of User
  async getAllCommentsOfUser(user: User) {
    return await this.repo.find({
      where: { user: user },

      //populate relations
      relations: { blog: true },
    });
  }

  //get All Comments Of Blog
  async getAllCommentsOfBlog(blog: Blog) {
    return await this.repo.find({ where: { blog: blog } });
  }
}
