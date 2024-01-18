import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos/create_commnt.dto';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { User } from 'src/users/user.entity';
import { CommentsService } from '../service/comments.service';
import { BlogsService } from 'src/blogs/service/blogs.service';
import { LoggedInGuard } from 'src/guards/loggedUser.guard';
import { UpdateCommentDto } from '../dtos/update_comment.dto';
import { Comment } from '../comments.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(
    private commentService: CommentsService,
    private blogService: BlogsService,
  ) {}

  //CREATE
  @Post('/')
  @UseGuards(LoggedInGuard)
  async addComment(@Body() body: CreateCommentDto, @CurrentUser() user: User) {
    const blog = await this.blogService.getById(body.blog_id);
    if (!blog) throw new NotFoundException('Blog Not Found');

    return await this.commentService.create(body, blog, user);
  }

  //UPDATE
  @Put('/:id')
  @UseGuards(LoggedInGuard)
  async editComment(
    @Body() body: UpdateCommentDto,
    @CurrentUser() user: User,
    @Param('id') id: number,
  ) {
    const userComments = await this.commentService.getAllCommentsOfUser(user);
    let userComment: Comment;
    userComments.forEach((comment) => {
      if (comment.id == id) {
        userComment = comment;
      }
    });

    if (!userComment) throw new NotFoundException('comment Not Found');

    return await this.commentService.update(id, body);
  }

  //DELETE
  @Delete('/:id')
  @UseGuards(LoggedInGuard)
  async deleteComment(@Param('id') id: number, @CurrentUser() user: User) {
    if (user.isAdmin) {
      return this.commentService.delete(id);
    }

    const userComments = await this.commentService.getAllCommentsOfUser(user);
    let userComment: Comment;
    userComments.forEach((comment) => {
      if (comment.id == id) {
        userComment = comment;
      }
    });

    if (!userComment) throw new NotFoundException('comment Not Found');

    return await this.commentService.delete(id);
  }

  //GET ALL USER COMMENTS
  @Get('/')
  @UseGuards(LoggedInGuard)
  async getAllUserComments(@CurrentUser() user: User) {
    return await this.commentService.getAllCommentsOfUser(user);
  }

  //GET ALL BLOG COMMENTS
  @Get('/:blog_id')
  @UseGuards(LoggedInGuard)
  async getAllBlogComments(
    @Param('blog_id') blog_id: number,
    @CurrentUser() user: User,
  ) {
    const blog = await this.blogService.getById(blog_id);
    if (!blog) throw new NotFoundException('blog Not Found');
    return await this.commentService.getAllCommentsOfBlog(blog);
  }
}
