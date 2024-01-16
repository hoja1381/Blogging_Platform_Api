import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { BlogsService } from '../service/blogs.service';
import { Create_blogDto } from '../dtos/create_blog.dto';
import { User } from 'src/users/user.entity';
import { LoggedInGuard } from 'src/guards/loggedUser.guard';
import { Blog } from '../blog.entity';
import { AdminGuard } from 'src/guards/adminastor.guard';
import { UsersService } from 'src/users/service/users.service';
import { Update_blogDto } from '../dtos/update_blog.dto';
import { Serialize } from 'src/interceptors/serialazaition.interceptor';
import { BlogDto } from '../dtos/Blog.dto';

@ApiTags('blog')
@Controller('blogs')
@Serialize(BlogDto)
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private userService: UsersService,
  ) {}

  //CREATE
  @Post('/')
  @UseGuards(LoggedInGuard)
  async createBlog(@Body() body: Create_blogDto, @CurrentUser() user: User) {
    return await this.blogService.create(body, user);
  }

  //UPDATE
  @Put('/:id')
  @UseGuards(LoggedInGuard)
  async updateBlog(
    @Body() body: Update_blogDto,
    @Param('id') id: number,
    @CurrentUser() user: User,
  ) {
    if (user.isAdmin) {
      return await this.blogService.update(id, body);
    }

    const userBlogs = await this.blogService.getAllByUser(user);
    let currentUserBlog: Blog;
    userBlogs.forEach((blog) => {
      if (blog.id == id) currentUserBlog = blog;
    });
    if (currentUserBlog) {
      return await this.blogService.update(id, body);
    } else {
      throw new ForbiddenException(
        'you are not allowed to update another user blog.',
      );
    }
  }

  //DELETE
  @Delete('/:id')
  @UseGuards(LoggedInGuard)
  async deleteBlog(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.isAdmin) {
      return await this.blogService.delete(id);
    }

    const userBlogs = await this.blogService.getAllByUser(user);
    let currentUserBlog: Blog;
    userBlogs.forEach((blog) => {
      if (blog.id == id) currentUserBlog = blog;
    });
    if (currentUserBlog) {
      return await this.blogService.delete(id);
    } else {
      throw new ForbiddenException(
        'you are not allowed to delete another user blog.',
      );
    }
  }

  //GET ALL BLOGS
  @Get('/')
  async getAllBlogs() {
    return await this.blogService.getAll();
  }

  // GET ALL BLOGS OF THE USER
  @Get('/myblogs')
  @UseGuards(LoggedInGuard)
  async getAllBlogsOfUser(@CurrentUser() user: User) {
    return await this.blogService.getAllByUser(user);
  }

  //GET USERS BLOG BY ADMIN
  @Get('/admin/:user_id')
  @UseGuards(AdminGuard)
  async getUsersBlogsByAdmin(@Param('user_id') id: number) {
    const user = await this.userService.findById(id);
    return await this.blogService.getAllByUser(user);
  }

  //GET BLOG BY ITS ID
  @Get('/:id')
  @UseGuards(AdminGuard)
  async getBlogById(@Param('id') id: number) {
    return await this.blogService.getById(id);
  }
}
