import { Inject, Injectable } from '@nestjs/common';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Transporter } from 'nodemailer';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from '../emitters/event-types.interface';
import { DateTime } from 'luxon';

import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { DeleteTopicCommand } from '@aws-sdk/client-sns';
import { FoodTrackerService } from '../food-tracker/food-tracker.service';
import { WaterTrackerService } from '../water-tracker/water-tracker.service';
import { NestApplication } from '@nestjs/core';

@Injectable()
export class EmailService {
  constructor(
    @Inject('NODEMAILER_TRANSPORTER') private readonly transporter: Transporter,
    private readonly foodTrackerServide: FoodTrackerService,
    private readonly waterTrackerService: WaterTrackerService,
  ) {}

  @OnEvent('user.registered', { async: true })
  async sendWelcomeEmail(data: EventPayloads['user.registered']) {
    const { name, email } = data;
    try {
      const templatePath = path.join(
        __dirname,
        '../../templates/welcome-email.ejs',
      );
      const template = fs.readFileSync(templatePath, 'utf8');
      const html = ejs.render(template, {
        name,
      });

      await this.transporter.sendMail({
        from: '"Nutriflow" <nutriflow@gmail.com>',
        to: email,
        subject: `Bienvenido a Nutriflow ${name}`,
        html,
      });
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }

  @OnEvent('premium.subscription.created', { async: true })
  async sendSubscriptionCongratsEmail(
    data: EventPayloads['premium.subscription.created'],
  ) {
    const { name, email, subscription, timeZone } = data;
    try {
      const templatePath = path.join(
        __dirname,
        '../../templates/subscription-congrats-email.ejs',
      );
      const template = fs.readFileSync(templatePath, 'utf8');
      const html = ejs.render(template, {
        name,
        created_at: DateTime.fromISO(subscription.created_at.toISOString())
          .setZone(timeZone)
          .toFormat('dd/MM/yyyy, hh:mm a'),
        // currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodStart: DateTime.fromISO(
          subscription.currentPeriodStart.toISOString(),
        )
          .setZone(timeZone)
          .toFormat('dd/MM/yyyy, hh:mm a'),
        // .toLocaleString(DateTime.DATETIME_SHORT),
        // currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        currentPeriodEnd: DateTime.fromISO(
          subscription.currentPeriodEnd.toISOString(),
        )
          .setZone(timeZone)
          // .toLocaleString(DateTime.DATETIME_SHORT),
          .toFormat('dd/MM/yyyy, hh:mm a'),
      });
      await this.transporter.sendMail({
        from: '"Nutriflow" <nutriflow@gmail.com>',
        to: email,
        subject: `Felicidades por adquirir tu suscripción premium ${name}`,
        html,
      });
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }

  @OnEvent('user.reminders', { async: true })
  async sendReminderEmail(data: EventPayloads['user.reminders']) {
    const { name, email, userId, caloriesGoal, waterGoal, timeZone } = data;

    const waterConsumedData =
      await this.waterTrackerService.getDailyWaterTracker(userId);

    let userFecha: string;

    if (!timeZone) {
      userFecha = DateTime.now()
        .setZone('America/Argentina/Buenos_Aires')
        .toISODate();
    } else {
      userFecha = DateTime.now().setZone(timeZone).toISODate();
    }

    const caloriesConsumedData = await this.foodTrackerServide.getDailyCalories(
      userId,
      userFecha,
    );
    let waterConsumed: number;
    if (!waterConsumedData.waterTracker) {
      waterConsumed = 0;
    } else {
      waterConsumed = waterConsumedData.waterTracker.amount;
    }
    const caloriesConsumed: number = caloriesConsumedData.caloriesConsumed;
    try {
      const templatePath = path.join(
        __dirname,
        '../../templates/reminder-email.ejs',
      );
      const template = fs.readFileSync(templatePath, 'utf8');
      const html = ejs.render(template, {
        name,
        waterConsumed,
        waterGoal,
        caloriesConsumed,
        caloriesGoal,
      });

      await this.transporter.sendMail({
        from: '"Nutriflow" <nutriflow@gmail.com>',
        to: email,
        subject: `Informe diario ${name}`,
        html,
      });
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }
}
