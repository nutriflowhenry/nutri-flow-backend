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
    Req, Put,
} from '@nestjs/common';
import { FoodTrackerService } from './food-tracker.service';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { GetFoodTrackerDto } from './dto/get-food-tracker.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { subscribeOn } from 'rxjs';

@Controller('food-tracker')
export class FoodTrackerController {
    constructor(private readonly foodTrackerService: FoodTrackerService) {
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async createFoodTracker(
        @Req() req: { user: { sub: string } },
        @Body() foodTrackeData: CreateFoodTrackerDto,
    ) {
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
            req.user.sub,
            queryDate?.date,
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
            queryDate,
        );
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async deleteFoodTracker(
        @Param('id', ParseUUIDPipe) foodTrackerId: string,
        @Req() req: { user: { sub: string } },
    ) {
        return this.foodTrackerService.deleteFoodTracker(
            foodTrackerId,
            req.user.sub,
        );
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
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

    @Put(':foodTrackerId/image')
    @UseGuards(AuthGuard)
    async updateImage(
        @Req() req: { user: { sub: string } },
        @Param('foodTrackerId') foodTrackerId: string,
        @Body('fileType') fileType: string,): Promise<object> {
        await this.foodTrackerService.updateMealImage(foodTrackerId, req.user.sub, fileType);
        return { message: 'Meal picture updated successfully' };
    }
}
