import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import { Provider } from '@nestjs/common';
dotenvConfig({ path: '.env' });

export const NodeMailerProvider: Provider = {
  provide: 'NODEMAILER_TRANSPORTER',
  useFactory: () => {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  },
};
