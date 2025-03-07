import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CloudFrontService } from './aws/cloud-front.service';
import { FoodTrackerService } from '../food-tracker/food-tracker.service';

@Controller('upload')
export class ImagesController {
    constructor(
        private readonly usersService: UsersService,
        private readonly cloudFrontService: CloudFrontService,
        private readonly foodTrackerService: FoodTrackerService) {
    }

    @Get('profile/upload-url/:userId')
    getProfileUploadUrl(
        @Param('userId') userId: string,
        @Query('fileType') fileType: string): Promise<string> {
        return this.usersService.getImageUploadUrl(userId, fileType);
    }


    @Get('meal/upload-url/:foodTrackerId')
    getMealUploadUrl(
        @Param('foodTrackerId') foodTrackerId: string,
        @Query('fileType') fileType: string,): Promise<string> {
        return this.foodTrackerService.getImageUploadUrl(foodTrackerId, fileType);
    }

}
