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

@Injectable()
export class EmailService {
  constructor(
    @Inject('NODEMAILER_TRANSPORTER') private readonly transporter: Transporter,
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
}
