import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { Blog } from 'src/blogs/blog.entity';
import { BlogsService } from 'src/blogs/service/blogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Blog]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, BlogsService],
})
export class CommentsModule {}
