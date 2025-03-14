import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodTracker } from './entities/food-tracker.entity';
import { Between, Repository, UpdateResult } from 'typeorm';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { DateTime } from 'luxon';

@Injectable()
export class FoodTrackerRepository {
  constructor(
    @InjectRepository(FoodTracker)
    private readonly foodTrackerRepository: Repository<FoodTracker>,
  ) {}

  async createFoodTracker(
    foodTrackerData: CreateFoodTrackerDto,
    userProfile: UserProfile,
  ): Promise<FoodTracker> {
    foodTrackerData.createdAt = foodTrackerData.createdAt
      ? foodTrackerData.createdAt
      : new Date().toISOString();
    const foodTracker: FoodTracker = this.foodTrackerRepository.create({
      ...foodTrackerData,
      userProfile,
    });
    return await this.foodTrackerRepository.save(foodTracker);
  }

  async getDailyFooodTracker(
    profile: UserProfile,
    limit: number,
    page: number,
    date?: string,
    timeZone: string = 'America/Mexico_City',
  ) {
    const dayRange = this.getStartAndEndOfDay(date, timeZone);

    const [results, total] = await this.foodTrackerRepository.findAndCount({
      where: {
        userProfile: profile,
        createdAt: Between(dayRange.startUTC, dayRange.endUTC),
      },
      order: {
        createdAt: 'DESC',
        id: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results,
      total,
    };
  }

  async getAllFoodTrackerByUser(
    userProfile: UserProfile,
  ): Promise<FoodTracker[] | []> {
    return this.foodTrackerRepository.find({
      where: {
        userProfile,
      },
    });
  }

  async getDailyCalories(
    profile: UserProfile,
    date: string,
    timeZone: string = 'America/Mexico_City',
  ): Promise<FoodTracker[] | []> {
    const dayRange = this.getStartAndEndOfDay(date, timeZone);
    return this.foodTrackerRepository.find({
      where: {
        createdAt: Between(dayRange.startUTC, dayRange.endUTC),
        userProfile: profile,
      },
      select: ['calories'],
    });
  }

  getStartAndEndOfDay(date?: string, timeZone: string = 'America/Mexico_City') {
    const userDate = date
      ? DateTime.fromJSDate(new Date(date)).setZone(timeZone)
      : DateTime.now().setZone(timeZone);

    const startOfDay = userDate.startOf('day');
    const endOfDay = userDate.endOf('day');

    const startUTC = startOfDay.toUTC().toJSDate();
    const endUTC = endOfDay.toUTC().toJSDate();

    return {
      startUTC,
      endUTC,
    };
  }

  async delete(foodTracker: FoodTracker): Promise<void> {
    await this.foodTrackerRepository.remove(foodTracker);
  }

  async deactivate(foodTracker: FoodTracker): Promise<UpdateResult> {
    const result: UpdateResult = await this.foodTrackerRepository.update(
      foodTracker.id,
      { isActive: false },
    );
    return result;
  }

  async updateFoodTracker(
    validateFoodTracker: FoodTracker,
    updateFoodTrackerData: UpdateFoodTrackerDto,
  ) {
    const dtoFields: string[] = Object.keys(updateFoodTrackerData);
    if (dtoFields.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron datos para realizar una actualización',
      );
    }
    const originalFoodTracker: FoodTracker = { ...validateFoodTracker };
    this.foodTrackerRepository.merge(
      validateFoodTracker,
      updateFoodTrackerData,
    );
    const isNotUpdated: boolean = dtoFields.every(
      (field) => validateFoodTracker[field] === originalFoodTracker[field],
    );

    if (isNotUpdated) {
      throw new BadRequestException(
        'No se pudieron realizar cambios en el registro, revise los valores enviados',
      );
    }

    await this.foodTrackerRepository.save(validateFoodTracker);
    return validateFoodTracker;
  }
}
