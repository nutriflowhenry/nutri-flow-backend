import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerRepository } from './water-tracker.repository';
import { WaterTracker } from './entities/water-tracker.entity';

@Injectable()
export class WaterTrackerService {
  constructor(
    private readonly watertrackerRepository: WaterTrackerRepository,
  ) {}

  async create(createWaterTrackerDto: CreateWaterTrackerDto) {
    // Cuando este creado el servicio de usuario se usará para encontrar el verdadero usuario por el momento se registrará sin
    try {
      const newWaterTracker: WaterTracker =
        await this.watertrackerRepository.createWaterTracker(
          createWaterTrackerDto,
          // userId,
        );
      const newTotalWaterConsumptionPerDay: number = (
        await this.getTotalWaterConsumptionPerDay(newWaterTracker.date)
      ).totalConsumption;
      return {
        message: 'Registro de consumo de agua exitoso',
        recentWaterConsumption: newWaterTracker,
        totalWaterConsumption: newTotalWaterConsumptionPerDay,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al registrar el consumo de agua en la base de datos',
        error.message,
      );
    }
  }

  async getTotalWaterConsumptionPerDay(day: Date) {
    // Cuando estén listos los usuarios se añadira aquí para realizar la busqueda
    let totalConsumption: number;
    const dailyWaterTracer: WaterTracker[] =
      await this.watertrackerRepository.findAllWaterTrackerByDay(day);
    totalConsumption = dailyWaterTracer.reduce(
      (sum, record) => sum + record.amount,
      0,
    );
    return {
      totalConsumption,
    };
  }

  async getWaterConsumptionPerDay(day: Date) {
    const allWaterConsumptionDataPerDay: WaterTracker[] =
      await this.watertrackerRepository.findAllWaterTrackerByDay(day);
    return {
      date: day,
      WaterConsumptionData: allWaterConsumptionDataPerDay,
    };
  }
}
