import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { Blog } from 'src/blogs/blog.entity';
import { BlogsModule } from 'src/blogs/blogs.module';

@Module({
  imports: [
    //set up TypeOrm Tables
    TypeOrmModule.forFeature([Comment, Blog]),
    BlogsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
