import { Module } from '@nestjs/common';
import { FoodTrackerService } from './food-tracker.service';
import { FoodTrackerController } from './food-tracker.controller';
import { FoodTrackerRepository } from './food-tracker.repository';
import { FoodTracker } from './entities/food-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodTracker]),
    UsersModule,
    UserProfilesModule,
  ],
  controllers: [FoodTrackerController],
  providers: [FoodTrackerRepository, FoodTrackerService],
})
export class FoodTrackerModule {}
