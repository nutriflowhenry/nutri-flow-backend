import { Module } from '@nestjs/common';
import { FoodTrackerService } from './food-tracker.service';
import { FoodTrackerController } from './food-tracker.controller';
import { FoodTrackerRepository } from './food-tracker.repository';
import { FoodTracker } from './entities/food-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';
import { S3Service } from '../aws/s3-service';
import { AwsModule } from '../aws/aws.module';

@Module({
    controllers: [FoodTrackerController],
    imports: [
        TypeOrmModule.forFeature([FoodTracker]),
        UsersModule,
        UserProfilesModule,
        AwsModule
    ],
    providers: [FoodTrackerRepository, FoodTrackerService],
    exports: [FoodTrackerService, FoodTrackerRepository],
})
export class FoodTrackerModule {
}
