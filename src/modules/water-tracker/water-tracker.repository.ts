import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaterTracker } from './entities/water-tracker.entity';
import { Between, Repository } from 'typeorm';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { DateTime, Zone } from 'luxon';
import { GetAllWaterTrackerDto } from './dto/get-all-water-tracker.dto';

@Injectable()
export class WaterTrackerRepository {
  //     queryDate.getUTCMonth(),
  //     queryDate.getUTCDate() + 1,
  //   ),
  // );
  constructor(
    @InjectRepository(WaterTracker)
    private readonly waterTrackerRepository: Repository<WaterTracker>,
  ) { }

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
      updatedAmount += dataUpdate.amount;
    } else if (dataUpdate.action === WaterTrackerAction.DECREMENT) {
      updatedAmount = Math.max(0, updatedAmount - dataUpdate.amount);
    }

    this.waterTrackerRepository.merge(dailyWaterTracker, {
      amount: updatedAmount,
    });

    await this.waterTrackerRepository.save(dailyWaterTracker);
    return dailyWaterTracker;
  }

  async getWaterTrackerByDate(
    userProfile: UserProfile,
    date: string, // YYYY-MM-DD
    timeZone: string = 'America/Mexico_City'
  ): Promise<WaterTracker | null> {
    // Convertir la fecha de entrada a inicio y fin de día en la zona horaria del usuario
    const userDate = DateTime.fromISO(date, {zone: timeZone})

    if (!userDate.isValid) {
      throw new Error(`Fecha inválida: ${userDate.invalidExplanation}`);
    }

    // Convertir a UTC para la consulta
    const startUTC = userDate.startOf('day').toUTC().toJSDate();
    const endUTC = userDate.endOf('day').toUTC().toJSDate();
    return this.waterTrackerRepository.findOne({
      where: {
        date: Between(startUTC, endUTC),
        userProfile
      }
    });
  }

  async getAll(
    userProfile: UserProfile,
    limit: number,
    skip: number,
  ): Promise<[WaterTracker[], number]> {
    return this.waterTrackerRepository.findAndCount({
      where: {
        userProfile: userProfile,
      },
      order: {
        date: 'DESC',
        id: 'ASC',
      },
      skip,
      take: limit,
    });
  }

  private getStartAndEndOfDay(
    date?: string,
    timeZone: string = 'America/Mexico_City',
  ) {
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
}