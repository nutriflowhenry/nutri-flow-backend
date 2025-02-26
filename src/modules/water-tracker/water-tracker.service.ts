import { Injectable } from '@nestjs/common';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';

@Injectable()
export class WaterTrackerService {
  create(createWaterTrackerDto: CreateWaterTrackerDto) {
    return 'This action adds a new waterTracker';
  }

  findAll() {
    return `This action returns all waterTracker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waterTracker`;
  }

  update(id: number, updateWaterTrackerDto: UpdateWaterTrackerDto) {
    return `This action updates a #${id} waterTracker`;
  }

  remove(id: number) {
    return `This action removes a #${id} waterTracker`;
  }
}
