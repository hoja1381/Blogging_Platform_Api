import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { BlogsService } from '../service/blogs.service';
import { Create_blogDto } from '../dtos/create_blog.dto';
import { User } from 'src/users/user.entity';
import { LoggedInGuard } from 'src/guards/loggedUser.guard';

@ApiTags('blog')
@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  //CREATE
  @Post('/')
  @UseGuards(LoggedInGuard)
  async createBlog(@Body() body: Create_blogDto, @CurrentUser() user: User) {
    return await this.blogService.create(body, user);
  }
}
