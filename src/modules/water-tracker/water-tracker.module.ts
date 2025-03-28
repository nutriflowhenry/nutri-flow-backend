import { Module } from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { WaterTrackerController } from './water-tracker.controller';
import { WaterTracker } from './entities/water-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterTrackerRepository } from './water-tracker.repository';
import { UsersModule } from '../users/users.module';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaterTracker]),
    UsersModule,
    UserProfilesModule,
  ],
  controllers: [WaterTrackerController],
  providers: [WaterTrackerService, WaterTrackerRepository],
  exports: [WaterTrackerService],
})
export class WaterTrackerModule {}
