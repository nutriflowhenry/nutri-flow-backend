import {
   ForbiddenException,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { FoodTrackerRepository } from './food-tracker.repository';
import { FoodTracker } from './entities/food-tracker.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Injectable()
export class FoodTrackerService {
   constructor(
      private readonly foodTrackerRepository: FoodTrackerRepository,
      private readonly userService: UsersService,
      private readonly usersProfileServise: UserProfilesService,
   ) {
   }

   async createFoodTracker(
      foodTrackerData: CreateFoodTrackerDto,
      userId: string,
   ) {
      try {
         const validateUserProfile: UserProfile =
            await this.getUserProfile(userId);
         const foodTracker: FoodTracker =
            await this.foodTrackerRepository.createFoodTracker(
               foodTrackerData,
               validateUserProfile,
            );
         return {
            message: 'Registro de comida exitoso',
            foodTracker,
         };
      } catch (error) {
         throw error;
      }
   }

   async getDailyCalories(userId: string, date?: string) {
      const validateUserProfile: UserProfile = await this.getUserProfile(userId);
      const today: string = date || new Date().toISOString();
      const dailyFoodTracker: FoodTracker[] =
         await this.foodTrackerRepository.getDailyFooodTracker(
            validateUserProfile,
            today,
         );
      const caloriesConsumed: number = dailyFoodTracker.reduce(
         (sum, food) => sum + food.calories,
         0,
      );
      return {
         message: `Calorias consumidad en el día ${date}`,
         caloriesConsumed,
      };
   }

   async getDailyFoodTracker(userId: string, date?: string) {
      const today: string = date || new Date().toISOString();
      const validateUserProfile: UserProfile = await this.getUserProfile(userId);
      const dailyFoodTracker: FoodTracker[] =
         await this.foodTrackerRepository.getDailyFooodTracker(
            validateUserProfile,
            today,
         );
      return {
         message: `Registro totales de comida para el día ${date}`,
         dailyFoodTracker,
      };
   }

   async getUserProfile(userId: string): Promise<UserProfile> {
      const user: User | null = await this.userService.findById(userId);
      if (!user) {
         throw new NotFoundException('Usuario no encontrado');
      }
      if (!user.userProfile) {
         throw new NotFoundException('El usuario no tiene perfil asociado');
      }
      const userProfile: UserProfile = await this.usersProfileServise.findOneById(
         user.userProfile.id,
      );
      if (!userProfile) {
         throw new NotFoundException('Perfil no encontrado');
      } else {
         return userProfile;
      }
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
      const validUserProfile: UserProfile = await this.getUserProfile(userId);
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
