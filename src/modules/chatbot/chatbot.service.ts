import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.dto';


@Injectable()
export class ChatbotService {

   private userSessions = new Map<string, ChatCompletionMessageDto[]>();

   constructor(private readonly openai: OpenAI) {
   }

   async createChatCompletion(userId: string, messages: ChatCompletionMessageDto[]) {
      if (!this.userSessions.has(userId)) {
         this.userSessions.set(userId, []);
      }

      const userConversation = this.userSessions.get(userId);
      userConversation.push(...messages);

      const response =
          await this.openai.chat.completions.create({
             model: 'gpt-4o-mini',
             messages: [
                {
                   role: 'system',
                   content: 'You are a nutritionist. Before giving advice, ask relevant questions (e.g., weight, height, activity level). Keep responses as concise as possible while remaining helpful'
                },
                ...userConversation as OpenAI.Chat.Completions.ChatCompletionMessage[],
             ],
          });

      userConversation.push(response.choices[0].message);
      return response.choices[0].message;

   }
}
