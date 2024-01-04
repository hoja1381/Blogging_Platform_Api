import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CRUD_UserDto } from '../dtos/crud_user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(body: CRUD_UserDto) {}
  update(id: string, body: CRUD_UserDto) {}
  delete(id: string) {}
  find(body: CRUD_UserDto) {}
  findOne(body: CRUD_UserDto) {}
  findById(id: string) {}
}
