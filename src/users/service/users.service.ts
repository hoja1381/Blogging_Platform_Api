import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { Update_UserDto } from '../dtos/update_user.dto';
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
  async update(id: number, body: Update_UserDto) {
    //if there is no id or body returns NULL
    if (!id || !Object.keys(body).length) return null;

    // find and update the user //not proper solution
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('user not found');

    await this.repo.update({ id: id }, body);

    return await this.findById(id);
  }

  async makeAdmin(id: number, isAdmin: boolean) {
    //if there is no id  returns NULL
    if (!id) return null;

    // find and update the user //not proper solution
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('user not found');

    await this.repo.update({ id: id }, { isAdmin });

    return await this.findById(id);
  }

  // delete user in db by id
  async delete(id: number) {
    if (!id) return null;
    const user = await this.repo.findOne({ where: { id: id } });
    if (!user)
      throw new NotFoundException('there is no user to delete with that id.');

    return this.repo.remove(user);
  }

  // find users by the given info.
  async find() {
    return await this.repo.find({ relations: { blogs: true, comments: true } });
  }

  // find user by id
  async findById(id: number) {
    if (!id) return null;
    return await this.repo.findOne({
      where: { id: id },
      relations: { blogs: true, comments: true },
    });
  }

  // find user by email
  async findByEmail(email: string) {
    if (!email) return null;
    return await this.repo.findOne({
      where: { email: email },
      relations: { blogs: true, comments: true },
    });
  }

  // find user by username
  async findByUsername(username: string) {
    if (!username) return null;
    return await this.repo.findOne({
      where: { username: username },
      relations: { blogs: true, comments: true },
    });
  }
}
