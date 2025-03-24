import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FoodTrackerService } from '../food-tracker/food-tracker.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PostService } from '../post/post.service';


@Controller('upload')
export class ImagesController {

    constructor(
        private readonly postService: PostService,
        private readonly usersService: UsersService,
        private readonly foodTrackerService: FoodTrackerService) {
    }

    @Get('profile/upload-url/:userId')
    @UseGuards(AuthGuard)
    async getProfilePictureUploadUrl(
        @Param('userId') userId: string,
        @Query('type') fileType: string): Promise<{ uploadUrl: string }> {
        const uploadUrl = await this.usersService.getImageUploadUrl(userId, fileType);
        return { uploadUrl };
    }


    @Get('meal/upload-url/:foodTrackerId')
    @UseGuards(AuthGuard)
    async getMealImageUploadUrl(
        @Param('foodTrackerId') foodTrackerId: string,
        @Query('type') fileType: string): Promise<{ uploadUrl: string }> {
        const uploadUrl = await this.foodTrackerService.getImageUploadUrl(foodTrackerId, fileType);
        return { uploadUrl };
    }


    @Get('post/upload-url/:foodTrackerId')
    @UseGuards(AuthGuard)
    async getPostImageUploadUrl(
        @Param('postId') postId: string,
        @Query('type') fileType: string): Promise<{ uploadUrl: string }> {
        const uploadUrl = await this.postService.getImageUploadUrl(postId, fileType);
        return { uploadUrl };
    }
}
