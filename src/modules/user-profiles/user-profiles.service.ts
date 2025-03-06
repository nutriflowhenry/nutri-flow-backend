import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateUserProfileDto } from './dto/create-user-profile.dto';
// import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersProfileRepository } from './user-profile.repository';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserProfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersProfileRepository: UsersProfileRepository,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto, userId: string) {
    const userfound: User | null = await this.usersService.findById(userId);
    if (!userfound) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (userfound.userProfile) {
      throw new ConflictException('El usuario ya tiene un perfil creado');
    }
    const newProfile: UserProfile = await this.usersProfileRepository.create(
      createUserProfileDto,
      userfound,
    );

    const { user, ...sanitizedNewProfile } = newProfile;
    return {
      message: `Perfil de usuario creado exitosamente para el usuario ${userId}`,
      userProfileCreated: sanitizedNewProfile,
    };
  }

  async findOneById(id: string): Promise<UserProfile> {
    return this.usersProfileRepository.findById(id);
  }

  async findOneByUser(userId: string) {
    const profile: UserProfile =
      await this.usersProfileRepository.findByUser(userId);
    if (!profile) {
      throw new NotFoundException(
        `El usuario ${userId} no tiene un perfil de usuario asociado`,
      );
    }
    const { user, ...sanitizedUserProfile } = profile;
    return {
      message: `Perfil de usuario encontrado exitosamente para el usuario ${userId}`,
      userProfile: sanitizedUserProfile,
    };
  }
}
