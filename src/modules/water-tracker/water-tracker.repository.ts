import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaterTracker } from './entities/water-tracker.entity';
import { Between, Repository } from 'typeorm';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';

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

  async findAllWaterTrackerByDay(day: Date): Promise<WaterTracker[] | []> {
    // Cuándo estén listos los usuarios se buscará por usuario
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.waterTrackerRepository.find({
      where: {
        // user: user,
        date: Between(startOfDay, endOfDay),
      },
      order: {
        date: 'ASC',
      },
    });
  }
}
