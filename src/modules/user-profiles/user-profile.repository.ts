import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersProfileRepository {
  constructor(
    @InjectRepository(UserProfile) private repository: Repository<UserProfile>,
  ) {}

  async findById(id: string): Promise<UserProfile> {
    return this.repository.findOneBy({ id });
  }
}
