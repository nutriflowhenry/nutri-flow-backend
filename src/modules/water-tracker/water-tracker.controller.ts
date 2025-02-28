import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { GetWaterTrackerDto } from './dto/get-water-tracker.dto';

@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTrackerService: WaterTrackerService) {}

  @Post('update')
  async updateDailyWaterTracker(@Body() updateDto: UpdateWaterTrackerDto) {
    // Por el momento no se relaciona con un usuario
    // const user = req['user'];
    return this.waterTrackerService.updateDailyWaterTracker(updateDto);
  }
  @Get('daily')
  async getDailyWaterTracker(@Query() queryData: GetWaterTrackerDto) {
    // Por el momento no se relaciona con usuario
    const day: string = queryData.date;
    return this.waterTrackerService.getDailyWaterTracker(day);
  }
}
