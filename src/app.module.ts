import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Blog } from './blogs/blog.entity';
import { Comment } from './comments/comments.entity';
import { CacheModule } from '@nestjs/cache-manager';

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
    CacheModule.register({ ttl: 60, isGlobal: true, max: 10000000 }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
