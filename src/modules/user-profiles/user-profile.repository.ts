import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { Repository } from 'typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersProfileRepository {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async create(
    createUserProfileDto: CreateUserProfileDto,
    user: User,
  ): Promise<UserProfile> {
    const newProfile = this.userProfileRepository.create({
      ...createUserProfileDto,
      user,
    });
    return this.userProfileRepository.save(newProfile);
  }
  async findById(id: string): Promise<UserProfile | null> {
    return this.userProfileRepository.findOneBy({ id });
  }

  async findOneByUserId(userId: string): Promise<UserProfile | null> {
    return this.userProfileRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
