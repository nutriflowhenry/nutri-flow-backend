import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Module({
   imports: [ConfigModule],
   providers: [ChatbotService,
      {
         provide: OpenAI,
         useFactory: (configService: ConfigService) =>
             new OpenAI({ apiKey: configService.getOrThrow('OPENAI_API_KEY') }),
         inject: [ConfigService],
      }
   ],
   controllers: [ChatbotController]
})
export class ChatbotModule {
}
