import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodeMailerProvider } from 'src/config/node-mailer.config';
import { WaterTrackerModule } from '../water-tracker/water-tracker.module';
import { FoodTrackerModule } from '../food-tracker/food-tracker.module';

@Module({
  imports: [WaterTrackerModule, FoodTrackerModule],
  providers: [EmailService, NodeMailerProvider],
})
export class EmailModule {}
