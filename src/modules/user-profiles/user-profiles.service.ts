import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOneByUserId(userId: string) {
    const userProfile: UserProfile =
      await this.usersProfileRepository.findOneByUserId(userId);
    if (!userProfile)
      throw new NotFoundException(
        `El usuario ${userId} no cuenta con un perfil asociado`,
      );
    return {
      message: `Perfil de usuario encontrado exitosamente para el usuario ${userId}`,
      userProfile,
    };
  }

  async update(userId: string, updateUserProfileDto: UpdateUserProfileDto) {
    const userProfile: UserProfile = (await this.findOneByUserId(userId))
      .userProfile;
    const updatedUserProfile: UserProfile =
      await this.usersProfileRepository.update(
        userProfile,
        updateUserProfileDto,
      );
    return {
      message: `El perfil del usuario con id ${userId} se actualizó con exito`,
      updatedUserProfile,
    };
  }
}
