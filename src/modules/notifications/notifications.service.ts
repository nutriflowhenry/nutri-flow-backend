import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SmsService } from './sms.service';
import { UsersService } from '../users/users.service';
import { DateTime } from 'luxon';
import { TypedEventEmitter } from '../emitters/typed-event-emitter.class';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  // @Cron(CronExpression.EVERY_HOUR)
  // async handleDailyMorningNotifications() {
  //     console.log('Sending morning notifications...');
  //
  //     const usersToNotify = await this.usersService.findAllUsersWithNotificationsEnabled();
  //
  //     for (const user of usersToNotify) {
  //         const message = `Hola, ${user.name}! No olvides mantenerte hidratado hoy`;
  //         const userLocalHour = DateTime.now().setZone(user.timeZone).hour;
  //
  //         if (userLocalHour === 9) {
  //             await this.smsService.sendSms(user.phone, message);
  //         }
  //     }
  // }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAfternoonNotifications() {
    console.log('Sending afternoon notifications...');

    const usersToNotify =
      await this.usersService.findAllUsersWithNotificationsEnabled();

    for (const user of usersToNotify) {
      // const message = `Hola, ${user.name}! No olvides mantenerte hidratado hoy :)`;
      // await this.smsService.sendSms(user.phone, message);

      await this.eventEmitter.emitAsync('user.reminders', {
        email: user.email,
        name: user.name,
        waterGoal: user.userProfile.hydrationGoal,
        caloriesGoal: user.userProfile.caloriesGoal,
        userId: user.id,
        timeZone: user.timeZone,
      });
    }
  }
}
