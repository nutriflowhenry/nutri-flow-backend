import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { GetWaterTrackerDto } from './dto/get-water-tracker.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTrackerService: WaterTrackerService) {}

  @UseGuards(AuthGuard)
  @Post('update')
  async updateDailyWaterTracker(
    @Body() updateDto: UpdateWaterTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.waterTrackerService.updateDailyWaterTracker(
      updateDto,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('daily')
  async getDailyWaterTracker(
    @Query() queryData: GetWaterTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    const day: string = queryData.date;
    return this.waterTrackerService.getDailyWaterTracker(req.user.sub, day);
  }
}
