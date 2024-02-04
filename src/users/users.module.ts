import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { VerifyToken } from 'src/middleware/verify_token.middleware';

@Module({
  imports: [
    //set up TypeOrm Table
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {
  //use custom middleware for verify jwt tokens
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyToken).forRoutes('*');
  }
}
