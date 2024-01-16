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
  constructor(@InjectRepository(Blog) private repo: Repository<Blog>) {}

  async create(body: Create_blogDto, user: User) {
    const duplicatedBlog = await this.repo.findOne({
      where: { title: body.title },
    });
    if (duplicatedBlog) {
      throw new BadRequestException(
        'you cant add blogs with the exact same titles.',
      );
    }

    const newBlog = this.repo.create(body);
    newBlog.publishDate = new Date();
    newBlog.author = user;

    return await this.repo.save(newBlog);
  }

  async update(id: number, body: Update_blogDto) {
    if (!id || !Object.keys(body).length) return null;

    const blog = await this.getById(id);
    if (!blog) throw new NotFoundException('user not found');

    await this.repo.update({ id: id }, body);

    return await this.getById(id);
  }

  async delete(id: number) {
    if (!id) return null;
    const blog = await this.repo.findOne({ where: { id: id } });
    if (!blog)
      throw new NotFoundException('there is no user to delete with that id.');

    return this.repo.remove(blog);
  }

  async getAll() {
    return await this.repo.find({
      relations: { author: true },
      select: {
        author: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    });
  }

  async getById(id: number) {
    if (!id) return null;
    return await this.repo.findOne({
      where: { id: id },
      relations: { author: true },
      select: {
        author: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    });
  }

  async getAllByUser(user: User) {
    if (!user) return null;

    return await this.repo.find({ where: { author: user } });
  }
}
