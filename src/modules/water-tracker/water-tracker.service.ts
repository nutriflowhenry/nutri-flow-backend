import { Injectable } from '@nestjs/common';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerRepository } from './water-tracker.repository';
import { WaterTracker } from './entities/water-tracker.entity';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';

@Injectable()
export class WaterTrackerService {
  constructor(
    private readonly waterTrackerRepository: WaterTrackerRepository,
  ) {}

  async updateDailyWaterTracker(dataUpdate: UpdateWaterTrackerDto) {
    const today: string = new Date().toISOString().split('T')[0];
    let waterTracker: WaterTracker | null =
      await this.waterTrackerRepository.getWaterTrackerByDate(today);
    if (!waterTracker) {
      const initialAmount: number =
        dataUpdate.action === WaterTrackerAction.INCREMENT ? 1 : 0;
      waterTracker = await this.waterTrackerRepository.createWaterTracker({
        amount: initialAmount,
        date: today,
        // user: user,
      });
    } else {
      waterTracker = await this.waterTrackerRepository.updateWaterTracker(
        dataUpdate,
        waterTracker,
      );
    }
    const updatedWaterTracker: number = waterTracker.amount;
    return {
      message: 'Registro de consumo de agua actualizado con exito',
      updatedWaterTracker,
    };
  }

  async getDailyWaterTracker(date: string) {
    const waterTracker: WaterTracker | null =
      await this.waterTrackerRepository.getWaterTrackerByDate(date);
    if (!waterTracker) {
      return {
        message: 'No hay registros para la fecha solicitada',
      };
    }
    return {
      waterTracker,
    };
  }
}
