import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { FoodTrackerRepository } from './food-tracker.repository';
import { FoodTracker } from './entities/food-tracker.entity';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { GetFoodTrackerDto } from './dto/get-food-tracker.dto';

@Injectable()
export class FoodTrackerService {
  constructor(
    private readonly foodTrackerRepository: FoodTrackerRepository,
    private readonly usersProfileServise: UserProfilesService,
  ) {}

  async createFoodTracker(
    foodTrackerData: CreateFoodTrackerDto,
    userId: string,
    date?: string,
  ) {
    try {
      const validateUserProfile: UserProfile = (
        await this.usersProfileServise.findOneByUserId(userId)
      ).userProfile;
      const foodTracker: FoodTracker =
        await this.foodTrackerRepository.createFoodTracker(
          foodTrackerData,
          validateUserProfile,
          date,
        );

      const { userProfile, ...sanitizedFoodTracker } = foodTracker;
      return {
        message: 'Registro de comida exitoso',
        foodTracker: {
          ...sanitizedFoodTracker,
          userProfileId: validateUserProfile.id,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getDailyCalories(userId: string, date?: string) {
    const validateUserProfile: UserProfile = (
      await this.usersProfileServise.findOneByUserId(userId)
    ).userProfile;
    const today: string = date || new Date().toISOString();
    const dailyFoodTracker: FoodTracker[] =
      await this.foodTrackerRepository.getDailyCalories(
        validateUserProfile,
        today,
      );
    const caloriesConsumed: number = dailyFoodTracker.reduce(
      (sum, foodTracker) => sum + foodTracker.calories,
      0,
    );
    return {
      message: `Calorias consumidad en el día ${today}`,
      caloriesConsumed,
    };
  }

  async getDailyFoodTracker(
    userId: string,
    getFoodTrackerData: GetFoodTrackerDto,
  ) {
    const today: string = getFoodTrackerData.date || new Date().toISOString();
    const limit: number = getFoodTrackerData.limit || 10;
    const page: number = getFoodTrackerData.page || 1;
    const validateUserProfile: UserProfile = (
      await this.usersProfileServise.findOneByUserId(userId)
    ).userProfile;
    const dailyFoodTracker =
      await this.foodTrackerRepository.getDailyFooodTracker(
        validateUserProfile,
        limit,
        page,
        today,
      );
    return {
      message: `Registros de comida para el día ${today} considerando estar en la página ${page} con ${limit} registros por cada página`,
      data: {
        results: dailyFoodTracker.results,
        total: dailyFoodTracker.total,
        page: getFoodTrackerData.page,
        limit: getFoodTrackerData.limit,
        totalPages: Math.ceil(
          dailyFoodTracker.total / getFoodTrackerData.limit,
        ),
      },
    };
  }

  async getAllFoodTrackerByUser(
    userProfile: UserProfile,
  ): Promise<FoodTracker[]> {
    const allFoodTracker: FoodTracker[] | [] =
      await this.foodTrackerRepository.getAllFoodTrackerByUser(userProfile);
    if (!allFoodTracker) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar o modificar este registro o no existe',
      );
    }
    return allFoodTracker;
  }

  async validateUpadateDelete(
    userId: string,
    foodTrackerId: string,
  ): Promise<FoodTracker> {
    const validUserProfile: UserProfile = (
      await this.usersProfileServise.findOneByUserId(userId)
    ).userProfile;
    const allFoodTracker: FoodTracker[] =
      await this.getAllFoodTrackerByUser(validUserProfile);
    const foodTracker: FoodTracker = allFoodTracker.find(
      (foodTracker) => foodTracker.id === foodTrackerId,
    );
    if (!foodTracker) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar o modificar este registro o no existe',
      );
    } else {
      return foodTracker;
    }
  }

  async deleteFoodTracker(foodTrackerId: string, userId: string) {
    const validateFoodTracker: FoodTracker = await this.validateUpadateDelete(
      userId,
      foodTrackerId,
    );
    const deletedId: string = validateFoodTracker.id;
    await this.foodTrackerRepository.delete(validateFoodTracker);
    return {
      message: `El registro de foodTracker con id ${deletedId} fue borrado exitosamente`,
    };
  }

  async deactivateFoodTracker(foodTrackerId: string, userId: string) {
    const validateFoodTracker: FoodTracker = await this.validateUpadateDelete(
      userId,
      foodTrackerId,
    );
    if (!validateFoodTracker.isActive) {
      throw new ConflictException(
        'El registro de comida ya se encuentra desactivado',
      );
    }
    await this.foodTrackerRepository.deactivate(validateFoodTracker);
    return {
      message: `El registro de foodTracker con id ${validateFoodTracker.id} fue desactivado exitosamente`,
    };
  }

  async updateFoodTracker(
    foodTrackerId: string,
    userId: string,
    updateFoodTrackerData: UpdateFoodTrackerDto,
  ) {
    const validateFoodTracker: FoodTracker = await this.validateUpadateDelete(
      userId,
      foodTrackerId,
    );
    const updatedFoodTracker: FoodTracker =
      await this.foodTrackerRepository.updateFoodTracker(
        validateFoodTracker,
        updateFoodTrackerData,
      );
    return {
      message: 'Registro actualizado con exito',
      updatedFoodTracker,
    };
  }
}
