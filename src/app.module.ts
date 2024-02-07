import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Blog } from './blogs/blog.entity';
import { Comment } from './comments/comments.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logging.interceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // typeORM config
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Blog, Comment],
      synchronize: true,
    }),

    //imported modules
    UsersModule,
    BlogsModule,
    CommentsModule,

    //setUp caching system
    CacheModule.register({ ttl: 60000, isGlobal: true, max: 10000000 }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [
    //logger
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },

    // request rate limit
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
