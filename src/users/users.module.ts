import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthService } from './auth/auth.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
