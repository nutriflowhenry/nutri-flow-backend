import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FoodTrackerService } from '../food-tracker/food-tracker.service';


@Controller('upload')
export class ImagesController {

    constructor(
        private readonly usersService: UsersService,
        private readonly foodTrackerService: FoodTrackerService) {
    }

    @Get('profile/upload-url/:userId')
    async getProfileUploadUrl(
        @Param('userId') userId: string,
        @Query('type') fileType: string): Promise<{ uploadUrl: string }> {
        const uploadUrl = await this.usersService.getImageUploadUrl(userId, fileType);
        return { uploadUrl };
    }


    @Get('meal/upload-url/:foodTrackerId')
    async getMealUploadUrl(
        @Param('foodTrackerId') foodTrackerId: string,
        @Query('type') fileType: string,): Promise<{ uploadUrl: string }> {
        const uploadUrl = await this.foodTrackerService.getImageUploadUrl(foodTrackerId, fileType);
        return { uploadUrl };
    }
}
