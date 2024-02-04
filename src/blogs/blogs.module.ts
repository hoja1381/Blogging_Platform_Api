import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs.controller';
import { BlogsService } from './service/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    //set up TypeOrm Table
    TypeOrmModule.forFeature([Blog, User]),
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
