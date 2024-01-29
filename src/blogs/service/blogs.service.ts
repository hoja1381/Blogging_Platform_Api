import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../blog.entity';
import { Repository } from 'typeorm';
import { Create_blogDto } from '../dtos/create_blog.dto';
import { User } from 'src/users/user.entity';
import { Update_blogDto } from '../dtos/update_blog.dto';

@Injectable()
export class BlogsService {
  //DI
  constructor(@InjectRepository(Blog) private repo: Repository<Blog>) {}

  //create
  async create(body: Create_blogDto, user: User) {
    // check duplicated Blog
    const duplicatedBlog = await this.repo.findOne({
      where: { title: body.title },
    });
    if (duplicatedBlog) {
      throw new BadRequestException(
        'you cant add blogs with the exact same titles.',
      );
    }

    //crete object
    const newBlog = this.repo.create(body);
    //set values
    newBlog.publishDate = new Date();
    newBlog.author = user;

    // dave in DB and return
    return await this.repo.save(newBlog);
  }

  //update
  async update(id: number, body: Update_blogDto) {
    //check id & body
    if (!id || !Object.keys(body).length) return null;

    //check existence
    const blog = await this.getById(id);
    if (!blog) throw new NotFoundException('comment not found');

    //update  // issues CAN'T update with (this.repo.save) ??
    await this.repo.update({ id: id }, body);

    //return
    return await this.getById(id);
  }

  //delete
  async delete(id: number) {
    //check id
    if (!id) return null;

    //check existence
    const blog = await this.repo.findOne({ where: { id: id } });
    if (!blog)
      throw new NotFoundException('there is no user to delete with that id.');

    //return
    return this.repo.remove(blog);
  }

  //get All Blogs
  async getAll(skip = 0, take = 10) {
    //find and return
    return await this.repo.findAndCount({
      // populate relations
      relations: { author: true },

      // select fields
      select: {
        author: {
          id: true,
          username: true,
          fullName: true,
        },
      },

      // pagination
      skip: skip,
      take: take,
    });
  }

  //get ById
  async getById(id: number) {
    //check id
    if (!id) return null;

    // find and return
    return await this.repo.findOne({
      where: { id: id },

      // populate relations
      relations: { author: true },

      // select fields
      select: {
        author: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    });
  }

  //get All ByUser
  async getAllByUser(user: User) {
    //check user
    if (!user) return null;

    // find and return
    return await this.repo.find({ where: { author: user } });
  }
}
