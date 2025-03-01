import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FoodTrackerService } from './food-tracker.service';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { GetFoodTrackerDto } from './dto/get-food-tracker.dto';
import { AnyError } from 'typeorm';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('food-tracker')
export class FoodTrackerController {
  constructor(private readonly foodTrackerService: FoodTrackerService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  // Para pruebas, se pasa el id del usuario por parametro
  async createFoodTracker(
    @Req() req: { user: { sub: string } },
    @Body() foodTrackeData: CreateFoodTrackerDto,
    // @Query() userId: any,
  ) {
    // console.log(userId);
    return await this.foodTrackerService.createFoodTracker(
      foodTrackeData,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('dailyCalories')
  async findDailyCalories(
    @Query() queryDate: GetFoodTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.foodTrackerService.getDailyCalories(
      queryDate.date,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('daily')
  async findAllDailyFoodTracker(
    @Query() queryDate: GetFoodTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.foodTrackerService.getDailyFoodTracker(
      req.user.sub,
      queryDate.date,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete:id')
  async deleteFoodTracker(
    @Param('id', ParseUUIDPipe) foodTrackerId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.foodTrackerService.deleteFoodTracker(
      foodTrackerId,
      req.user.sub,
    );
  }

  @Patch('update:id')
  async updateFoodTracker(
    @Param('id', ParseUUIDPipe) foodTrackerId: string,
    @Body() updateFoodTrackerData: UpdateFoodTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.foodTrackerService.updateFoodTracker(
      foodTrackerId,
      req.user.sub,
      updateFoodTrackerData,
    );
  }
}
