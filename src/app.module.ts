import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [UsersModule, BlogsModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
