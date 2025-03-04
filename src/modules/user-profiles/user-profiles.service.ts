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
    const user: User | null = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (user.userProfile) {
      throw new ConflictException('El usuario ya tiene un perfil creado');
    }
    const newProfile: UserProfile = await this.usersProfileRepository.create(
      createUserProfileDto,
      user,
    );
    return {
      message: `Perfil de usuario creado exitosamente para el usuario ${userId}`,
      userProfileCreated: newProfile,
    };
  }

  async findOneById(id: string): Promise<UserProfile> {
    return this.usersProfileRepository.findById(id);
  }
}
