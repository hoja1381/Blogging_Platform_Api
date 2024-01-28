import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos/create_commnt.dto';
import { CurrentUser } from '../../decorators/current_user.decorator';
import { User } from '../../users/user.entity';
import { CommentsService } from '../service/comments.service';
import { BlogsService } from '../../blogs/service/blogs.service';
import { LoggedInGuard } from '../../guards/loggedUser.guard';
import { UpdateCommentDto } from '../dtos/update_comment.dto';
import { Comment } from '../comments.entity';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(
    private commentService: CommentsService,
    private blogService: BlogsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  //CREATE
  @Post('/')
  @UseGuards(LoggedInGuard)
  @ApiOperation({
    summary: 'adding comment on a blog',
    description:
      'add a comment on a blog and save it in the comments DB by the user and blog ids',
  })
  @ApiCreatedResponse({
    description: 'return the created comment',
    type: CreateCommentDto,
  })
  @ApiNotFoundResponse({
    description: 'return NotFoundException if the blog_id is not found.',
  })
  async addComment(@Body() body: CreateCommentDto, @CurrentUser() user: User) {
    const blog = await this.blogService.getById(body.blog_id);
    if (!blog) throw new NotFoundException('Blog Not Found');

    return await this.commentService.create(body, blog, user);
  }

  //UPDATE
  @Put('/:id')
  @UseGuards(LoggedInGuard)
  @ApiOperation({
    summary: 'editing comment on a blog',
    description:
      'edit a comment on a blog and update it in the comments DB by the user and blog ids',
  })
  @ApiOkResponse({
    description: 'return the updated comment',
    type: UpdateCommentDto,
  })
  @ApiNotFoundResponse({
    description: 'return NotFoundException if the blog_id is not found.',
  })
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
  @ApiOperation({
    summary: 'deleting comment on a blog',
    description:
      'delete a comment on a blog and delete it in the comments DB by the user and blog ids',
  })
  @ApiOkResponse({
    description: 'return the deleted comment',
    type: UpdateCommentDto,
  })
  @ApiNotFoundResponse({
    description: 'return NotFoundException if the blog_id is not found.',
  })
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
  @ApiOperation({
    summary: 'return all the comments by one user',
    description: 'return all the comments by one user',
  })
  @ApiOkResponse({
    description: 'return all the comments by one user',
  })
  @ApiNotFoundResponse({
    description: 'return NotFoundException if the user has no comments.',
  })
  async getAllUserComments(@CurrentUser() user: User) {
    const cache = await this.cacheManager.get(`commentsOfUser-${user.id}`);
    if (cache) return cache;

    const userComments = await this.commentService.getAllCommentsOfUser(user);
    await this.cacheManager.set(`commentsOfUser-${user.id}`, userComments);

    return userComments;
  }

  //GET ALL BLOG COMMENTS
  @Get('/:blog_id')
  @UseGuards(LoggedInGuard)
  @ApiOperation({
    summary: 'return all the comments of one blog',
    description: 'return all the comments of one blog',
  })
  @ApiOkResponse({
    description: 'return all the comments of one blog',
  })
  @ApiNotFoundResponse({
    description: 'return NotFoundException if the blog_id is not found.',
  })
  async getAllBlogComments(@Param('blog_id') blog_id: number) {
    const blog = await this.blogService.getById(blog_id);
    if (!blog) throw new NotFoundException('blog Not Found');

    const cache = await this.cacheManager.get(`commentsOfBlog-${blog_id}`);
    if (cache) return cache;

    const blogComments = await this.commentService.getAllCommentsOfBlog(blog);
    await this.cacheManager.set(`commentsOfBlog-${blog_id}`, blogComments);

    return blogComments;
  }
}
