import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaterTracker } from './entities/water-tracker.entity';
import { Between, Repository } from 'typeorm';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { DateTime } from 'luxon';

@Injectable()
export class WaterTrackerRepository {
  constructor(
    @InjectRepository(WaterTracker)
    private readonly waterTrackerRepository: Repository<WaterTracker>,
  ) {}

  async createWaterTracker(
    createWaterTrackerDto: CreateWaterTrackerDto,
  ): Promise<WaterTracker> {
    const newWaterTracker: WaterTracker = this.waterTrackerRepository.create({
      ...createWaterTrackerDto,
    });
    return await this.waterTrackerRepository.save(newWaterTracker);
  }

  async updateWaterTracker(
    dataUpdate: UpdateWaterTrackerDto,
    dailyWaterTracker: WaterTracker,
  ): Promise<WaterTracker> {
    let updatedAmount: number = dailyWaterTracker.amount;
    if (dataUpdate.action === WaterTrackerAction.INCREMENT) {
      updatedAmount += 50;
    } else if (dataUpdate.action === WaterTrackerAction.DECREMENT) {
      updatedAmount = Math.max(0, updatedAmount - 50);
    }
    this.waterTrackerRepository.merge(dailyWaterTracker, {
      amount: updatedAmount,
    });
    await this.waterTrackerRepository.save(dailyWaterTracker);
    return dailyWaterTracker;
  }

  async getWaterTrackerByDate(
    userProfile: UserProfile,
    date?: string,
    timeZone: string = 'America/Mexico_City',
  ): Promise<WaterTracker | null> {
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

    let waterTracker = await this.waterTrackerRepository.findOne({
      where: {
        date: Between(startUTC, endUTC),
        userProfile,
      },
    });
    return waterTracker;
  }
}
