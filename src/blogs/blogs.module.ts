import { Module } from '@nestjs/common';
import { BlogsController } from './controller/blogs.controller';
import { BlogsService } from './service/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { UsersService } from 'src/users/service/users.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    //set up TypeOrm Table
    TypeOrmModule.forFeature([Blog]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, UsersService],
})
export class BlogsModule {}
