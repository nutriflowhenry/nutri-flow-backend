import { Module } from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { WaterTrackerController } from './water-tracker.controller';
import { WaterTracker } from './entities/water-tracker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterTrackerRepository } from './water-tracker.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WaterTracker])],
  controllers: [WaterTrackerController],
  providers: [WaterTrackerService, WaterTrackerRepository],
})
export class WaterTrackerModule {}
