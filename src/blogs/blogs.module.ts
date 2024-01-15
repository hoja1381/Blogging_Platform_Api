import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs.controller';
import { BlogsService } from './service/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
