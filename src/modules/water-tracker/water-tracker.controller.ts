import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { GetWaterTrackerDto } from './dto/get-water-tracker.dto';

@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTrackerService: WaterTrackerService) {}

  @Post('create')
  create(@Body() createWaterTrackerDto: CreateWaterTrackerDto) {
    // const userId: string = createWaterTrackerDto.user;
    return this.waterTrackerService.create(createWaterTrackerDto);
  }

  @Get('total')
  getTotalWaterConsumptionPerDay(@Query() queryData: GetWaterTrackerDto) {
    let dayDate: Date;
    const day = queryData.date;
    if (!day) {
      dayDate = new Date();
    } else {
      dayDate = new Date(day);
    }
    return this.waterTrackerService.getTotalWaterConsumptionPerDay(dayDate);
  }

  @Get('all')
  getWaterConsumptionPerDay(@Query() queryData: GetWaterTrackerDto) {
    let dayDate: Date;
    const day = queryData.date;
    if (!day) {
      dayDate = new Date();
    } else {
      dayDate = new Date(day);
    }
    return this.waterTrackerService.getWaterConsumptionPerDay(dayDate);
  }
}
