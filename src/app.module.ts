import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Blog } from './blogs/blog.entity';
import { Comment } from './comments/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'hoja',
      database: 'hoja',
      entities: [User, Blog, Comment],
      synchronize: true,
    }),
    UsersModule,
    BlogsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
