import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { Repository } from 'typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { User } from '../users/entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

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

  async update(
    userProfile: UserProfile,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const dtoFields: string[] = Object.keys(updateUserProfileDto);
    if (dtoFields.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron datos para realizar una actualización',
      );
    }
    const originalUserProfile: UserProfile = { ...userProfile };
    this.userProfileRepository.merge(userProfile, updateUserProfileDto);
    const isNotUpdated: boolean = dtoFields.every(
      (field) => userProfile[field] === originalUserProfile[field],
    );

    if (isNotUpdated) {
      throw new BadRequestException(
        'No se pudieron realizar cambios en el registro, revise los valores enviados',
      );
    }

    await this.userProfileRepository.save(userProfile);
    return userProfile;
  }
}
