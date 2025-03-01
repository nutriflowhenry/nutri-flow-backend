import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  createUser(
    userData: Omit<CreateUserDto, 'passwordConfirmation'>,
  ): Promise<User> {
    return this.repository.save(userData);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOneBy({ id });
  }
}
