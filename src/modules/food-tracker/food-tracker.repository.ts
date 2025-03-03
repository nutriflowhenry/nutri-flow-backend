import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodTracker } from './entities/food-tracker.entity';
import { Between, Repository } from 'typeorm';
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
    const foodTracker: FoodTracker = this.foodTrackerRepository.create({
      ...foodTrackerData,
      userProfile,
    });
    console.log('food');
    console.log(foodTracker);
    return await this.foodTrackerRepository.save(foodTracker);
  }

  async getDailyFooodTracker(
    profile: UserProfile,
    date?: string,
    timeZone: string = 'America/Mexico_City',
  ) {
    console.log('up2');
    console.log(profile);
    // 1. Convertir la fecha a la zona horaria del usuario
    const userDate = date
      ? DateTime.fromJSDate(new Date(date)).setZone(timeZone)
      : DateTime.now().setZone(timeZone);

    // 2. Calcular inicio y fin del día EN LA ZONA HORARIA DEL USUARIO
    const startOfDay = userDate.startOf('day');
    const endOfDay = userDate.endOf('day');

    // 3. Convertir a UTC para la consulta en BD
    const startUTC = startOfDay.toUTC().toJSDate();
    const endUTC = endOfDay.toUTC().toJSDate();

    // const queryDate = new Date(date) || new Date();
    // const startOfDay = new Date(
    //   Date.UTC(
    //     queryDate.getUTCFullYear(),
    //     queryDate.getUTCMonth(),
    //     queryDate.getUTCDate(),
    //   ),
    // );

    // const endOfDay = new Date(
    //   Date.UTC(
    //     queryDate.getUTCFullYear(),
    //     queryDate.getUTCMonth(),
    //     queryDate.getUTCDate() + 1,
    //   ),
    // );

    return this.foodTrackerRepository.find({
      where: {
        createdAt: Between(startUTC, endUTC),
        userProfile: profile,
      },
    });
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
