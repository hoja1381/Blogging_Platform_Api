import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CRUD_UserDto } from '../dtos/crud_user.dto';
import { Register_UserDto } from '../dtos/register_user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  //  create user in db
  async create(body: Register_UserDto) {
    const user = this.repo.create(body);

    return this.repo.save(user);
  }

  // update user in db by id
  async update(id: string, body: Register_UserDto) {
    //if there is no id returns NULL
    if (!id) return null;

    // find and update the user
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, body);

    // return result
    return this.repo.save(user);
  }

  // delete user in db by id
  async delete(id: string) {
    if (!id) return null;
    const user = await this.repo.findOne({ where: { id: id } });
    if (!user)
      throw new NotFoundException('there is no user to delete with that id.');

    return this.repo.remove(user);
  }

  // find users by the given info.
  async find() {
    return await this.repo.find();
  }

  // find user by id
  async findById(id: string) {
    if (!id) return null;
    return await this.repo.findOne({ where: { id: id } });
  }

  // find user by email
  async findByEmail(email: string) {
    if (!email) return null;
    return await this.repo.findOne({ where: { email: email } });
  }

  // find user by username
  async findByUsername(username: string) {
    if (!username) return null;
    return await this.repo.findOne({ where: { username: username } });
  }
}
