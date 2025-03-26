import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodeMailerProvider } from 'src/config/node-mailer.config';

@Module({
  providers: [EmailService, NodeMailerProvider],
})
export class EmailModule {}
