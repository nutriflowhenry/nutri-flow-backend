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
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersProfileRepository: UsersProfileRepository,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto) {
    const userId: string = createUserProfileDto.user;
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
}
