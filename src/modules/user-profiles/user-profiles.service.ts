import { Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersProfileRepository } from './user-profile.repository';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserProfilesService {
  constructor(
    private readonly usersProfileRepository: UsersProfileRepository,
  ) {}
  async findOneById(id: string): Promise<UserProfile> {
    return this.usersProfileRepository.findById(id);
  }
}
