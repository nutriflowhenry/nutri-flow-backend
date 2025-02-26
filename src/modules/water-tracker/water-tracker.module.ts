import { Module } from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { WaterTrackerController } from './water-tracker.controller';

@Module({
  controllers: [WaterTrackerController],
  providers: [WaterTrackerService],
})
export class WaterTrackerModule {}
