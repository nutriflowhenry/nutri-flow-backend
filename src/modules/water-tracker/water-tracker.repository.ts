import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaterTracker } from './entities/water-tracker.entity';
import { Repository } from 'typeorm';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';

@Injectable()
export class WaterTrackerRepository {
  constructor(
    @InjectRepository(WaterTracker)
    private readonly waterTrackerRepository: Repository<WaterTracker>,
  ) {}

  async createWaterTracker(
    // Cuando estén listos los usuarios se vinculará cada registro con una entidad User
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
      updatedAmount += 1;
    } else if (dataUpdate.action === WaterTrackerAction.DECREMENT) {
      updatedAmount = Math.max(0, updatedAmount - 1);
    }
    this.waterTrackerRepository.merge(dailyWaterTracker, {
      amount: updatedAmount,
    });
    await this.waterTrackerRepository.save(dailyWaterTracker);
    return dailyWaterTracker;
  }

  async getWaterTrackerByDate(date: string): Promise<WaterTracker | null> {
    // Por el momento no se buscará por usuario
    let waterTracker = await this.waterTrackerRepository.findOne({
      where: { date },
    });
    return waterTracker;
  }
}
