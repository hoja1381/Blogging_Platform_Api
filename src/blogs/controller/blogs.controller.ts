import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../decorators/current_user.decorator';
import { BlogsService } from '../service/blogs.service';
import { Create_blogDto } from '../dtos/create_blog.dto';
import { User } from '../../users/user.entity';
import { LoggedInGuard } from '../../guards/loggedUser.guard';
import { Blog } from '../blog.entity';
import { AdminGuard } from '../../guards/adminastor.guard';
import { UsersService } from '../../users/service/users.service';
import { Update_blogDto } from '../dtos/update_blog.dto';
import { Serialize } from '../../interceptors/serialazaition.interceptor';
import { BlogDto } from '../dtos/Blog.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('blog')
@Controller('blogs')
@Serialize(BlogDto)
export class BlogsController {
  //DI
  constructor(
    private blogService: BlogsService,
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  //CREATE
  @Post('/')
  @UseGuards(LoggedInGuard)

  //swagger
  @ApiOperation({
    summary: 'create a blog',
    description: 'create a new blog. the user should be logged in.',
  })
  @ApiCreatedResponse({
    description: 'return the created blog.',
    type: BlogDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request if the input data is nor correct.',
  })
  @ApiForbiddenResponse({
    description: 'if you are not logged in',
  })

  //create Blog
  async createBlog(@Body() body: Create_blogDto, @CurrentUser() user: User) {
    return await this.blogService.create(body, user);
  }

  //UPDATE
  @Put('/:id')
  @UseGuards(LoggedInGuard)

  //swagger
  @ApiOperation({
    summary: 'update blog',
    description:
      'update blogs. the user can update it own blogs. and admin can update any blog.',
  })
  @ApiOkResponse({
    description: 'return the updated doc.',
    type: BlogDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request if the input data is nor correct.',
  })
  @ApiForbiddenResponse({
    description: 'if you are not logged in or not an admin',
  })

  //update Blog
  async updateBlog(
    @Body() body: Update_blogDto,
    @Param('id') id: number,
    @CurrentUser() user: User,
  ) {
    if (user?.isAdmin) {
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

  //swagger
  @ApiOperation({
    summary: 'delete blog',
    description:
      'delete blogs. the user can delete it own blogs. and admin can delete any blog.',
  })
  @ApiOkResponse({
    description: 'return the deleted doc.',
    type: BlogDto,
  })
  @ApiForbiddenResponse({
    description: 'if you are not logged in or not an admin',
  })

  //delete Blog
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

  //swagger
  @ApiOperation({
    summary: 'get all the blogs',
    description: 'return all the existed blogs.',
  })
  @ApiOkResponse({
    description: 'return all the existed blogs.',
    type: [BlogDto],
  })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })

  //getAll Blogs
  async getAllBlogs(@Query('take') take: number, @Query('skip') skip: number) {
    const cache = await this.cacheManager.get(`all-blogs-${take}-${skip}`);
    if (cache) return cache;

    const blogs = await this.blogService.getAll(skip, take);
    await this.cacheManager.set(`all-blogs-${take}-${skip}`, blogs);

    return blogs;
  }

  // GET ALL BLOGS OF THE USER
  @Get('/myblogs')
  @UseGuards(LoggedInGuard)

  //swagger
  @ApiOperation({
    summary: 'get All Blogs Of User',
    description: 'return all the existed blogs of one user.',
  })
  @ApiOkResponse({
    description: 'return all the existed blogs of one user.',
    type: [BlogDto],
  })

  //get All Blogs Of User
  async getAllBlogsOfUser(@CurrentUser() user: User) {
    const cache = await this.cacheManager.get(`blogs-${user.id}`);
    if (cache) return cache;

    const userBlogs = await this.blogService.getAllByUser(user);
    await this.cacheManager.set(`blogs-${user.id}`, userBlogs);
    return userBlogs;
  }

  //GET USERS BLOG BY ADMIN
  @Get('/admin/:user_id')
  @UseGuards(AdminGuard)

  //swagger
  @ApiOperation({
    summary: 'get All Blogs Of User by admin',
    description: 'return all the existed blogs of one user by admin.',
  })
  @ApiOkResponse({
    description: 'return all the existed blogs of one user by admin.',
    type: [BlogDto],
  })

  //get Users Blogs By Admin
  async getUsersBlogsByAdmin(@Param('user_id') id: number) {
    const cache = await this.cacheManager.get(`blogs-${id}`);
    if (cache) return cache;

    const user = await this.userService.findById(id);
    const userBlogs = await this.blogService.getAllByUser(user);

    await this.cacheManager.set(`blogs-${id}`, userBlogs);
    return userBlogs;
  }

  //GET BLOG BY ITS ID
  @Get('/:id')
  @UseGuards(AdminGuard)

  //swagger
  @ApiOperation({
    summary: 'get one blog by its Id',
    description: 'return one blog by its id. it is useable by admins',
  })
  @ApiOkResponse({
    description: 'return the blog with the given id.',
    type: BlogDto,
  })

  //get Blog By Id
  async getBlogById(@Param('id') id: number) {
    const cache = await this.cacheManager.get(id.toString());
    if (cache) return cache;

    const blog = await this.blogService.getById(id);
    console.log(id.toString());
    await this.cacheManager.set(id.toString(), blog);

    return blog;
  }
}
