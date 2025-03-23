import { ScheduleModule } from '@nestjs/schedule';
import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SmsService } from './sms.service';
import { UsersModule } from '../users/users.module';
import { TimeZoneService } from './time-zone.service';


@Module({
    imports: [ScheduleModule.forRoot(), forwardRef(() => UsersModule)],
    providers: [NotificationsService, SmsService, TimeZoneService],
    exports: [TimeZoneService],
})
export class NotificationsModule {
}