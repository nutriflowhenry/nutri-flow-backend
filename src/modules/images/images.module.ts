import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { UsersModule } from '../users/users.module';
import { AwsModule } from '../aws/aws.module';
import { FoodTrackerModule } from '../food-tracker/food-tracker.module';


@Module({
    controllers: [ImagesController],
    imports: [UsersModule, AwsModule, FoodTrackerModule],
    providers: [],
})
export class ImagesModule {
}