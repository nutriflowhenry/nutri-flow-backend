import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodTracker } from './entities/food-tracker.entity';
import { Between, Repository } from 'typeorm';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Injectable()
export class FoodTrackerRepository {
  constructor(
    @InjectRepository(FoodTracker)
    private readonly foodTrackerRepository: Repository<FoodTracker>,
  ) {}

  async createFoodTracker(
    // Cuando estén listos los usuarios se vinculará cada registro con una entidad User
    foodTrackerData: CreateFoodTrackerDto,
    userProfile: UserProfile,
  ): Promise<FoodTracker> {
    const foodTracker: FoodTracker = this.foodTrackerRepository.create({
      ...foodTrackerData,
      userProfile,
    });
    return await this.foodTrackerRepository.save(foodTracker);
  }

  async getDailyFooodTracker(profile: UserProfile, date?: string) {
    const queryDate = new Date(date) || new Date();
    const startOfDay = new Date(
      Date.UTC(
        queryDate.getUTCFullYear(),
        queryDate.getUTCMonth(),
        queryDate.getUTCDate(),
      ),
    );

    const endOfDay = new Date(
      Date.UTC(
        queryDate.getUTCFullYear(),
        queryDate.getUTCMonth(),
        queryDate.getUTCDate() + 1,
      ),
    );

    return this.foodTrackerRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
        userProfile: profile,
      },
    });
  }

  async delete(foodTracker: FoodTracker): Promise<void> {
    await this.foodTrackerRepository.remove(foodTracker);
  }

  async updateFoodTracker(
    validateFoodTracker: FoodTracker,
    updateFoodTrackerData: UpdateFoodTrackerDto,
  ) {
    this.foodTrackerRepository.merge(
      validateFoodTracker,
      updateFoodTrackerData,
    );
    await this.foodTrackerRepository.save(validateFoodTracker);
    return validateFoodTracker;
  }
}
