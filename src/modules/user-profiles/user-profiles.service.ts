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
import { INTENSITY_ML_PER_HOUR } from './constants/ml-Per-Hour.constants';
import { HYDRATION_RELATED_FIELDS } from './constants/hydration-relation-fields.constants';
import { ActivityLevel } from './enums/activity-level.enum';
import { HydrationCalculateData } from './interfaces/hydration-calculate-data.interface';
import { calculateHydrationGoal } from './utils/calculate-hydration-goal.utils';
import { calculateCaloriesGoal } from './utils/calculate-calorie-goal.utils';
import { calculateAge } from './utils/calculate-age.utils';
import { CALORIE_RELATION_FIELDS } from './constants/calorie-relation-fields.constants';
import { CalorieCalculateData } from './interfaces/calorie-calculate-data.interface';
import { Gender } from './enums/gender.enum';

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
    const mlHydrationGoal: number = calculateHydrationGoal({
      weight: createUserProfileDto.weight,
      activityLevel: createUserProfileDto.activityLevel,
    });
    const age: number = calculateAge(createUserProfileDto.birthdate);
    const caloriesGoal: number = calculateCaloriesGoal({
      activityLevel: createUserProfileDto.activityLevel,
      age,
      gender: createUserProfileDto.gender,
      height: createUserProfileDto.height,
      weight: createUserProfileDto.weight,
      weightGoal: createUserProfileDto.weightGoal,
    });
    const newProfile: UserProfile = await this.usersProfileRepository.create(
      createUserProfileDto,
      userfound,
      mlHydrationGoal,
      caloriesGoal,
      age,
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
    let newHydrationGoal: number;
    let newCaloriesGoal: number;
    let newAge: number;
    const userProfile: UserProfile = (await this.findOneByUserId(userId))
      .userProfile;
    const hasHydrationUpdate: boolean = HYDRATION_RELATED_FIELDS.some(
      (field) => updateUserProfileDto[field] !== undefined,
    );
    if (hasHydrationUpdate) {
      const weight: number = updateUserProfileDto.weight ?? userProfile.weight;
      const activityLevel: ActivityLevel =
        updateUserProfileDto.activityLevel ?? userProfile.activityLevel;
      newHydrationGoal = calculateHydrationGoal({ weight, activityLevel });
    }
    const hasCaloriesUpdate: boolean = CALORIE_RELATION_FIELDS.some(
      (field) => updateUserProfileDto[field] !== undefined,
    );
    if (hasCaloriesUpdate) {
      const age: number = updateUserProfileDto.birthdate
        ? calculateAge(updateUserProfileDto.birthdate)
        : userProfile.age;
      const updateCaloriesGoal: CalorieCalculateData = {
        activityLevel:
          updateUserProfileDto.activityLevel ?? userProfile.activityLevel,
        age,
        gender: updateUserProfileDto.gender ?? userProfile.gender,
        height: updateUserProfileDto.height ?? userProfile.height,
        weight: updateUserProfileDto.weight ?? userProfile.weight,
        weightGoal: updateUserProfileDto.weightGoal ?? userProfile.weightGoal,
      };
      newAge = age;
      newCaloriesGoal = calculateCaloriesGoal(updateCaloriesGoal);
    }
    const updatedUserProfile: UserProfile =
      await this.usersProfileRepository.update(
        userProfile,
        updateUserProfileDto,
        newHydrationGoal,
        newCaloriesGoal,
        newAge,
      );
    return {
      message: `El perfil del usuario con id ${userId} se actualizó con exito`,
      updatedUserProfile,
    };
  }
}
