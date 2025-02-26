import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { WaterTrackerModule } from './modules/water-tracker/water-tracker.module';

@Module({
  imports: [UsersModule, WaterTrackerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
