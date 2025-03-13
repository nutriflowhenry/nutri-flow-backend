import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { NodeMailerProvider } from 'src/config/node-mailer.config';

@Module({
  controllers: [EmailController],
  providers: [EmailService, NodeMailerProvider],
})
export class EmailModule {}
