import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatCompletionDto } from './dto/create-chat-completion.dto';
import { AuthGuard } from '../auth/guards/auth.guard';


@Controller('chatbot')
export class ChatbotController {

    constructor(private readonly chatbotService: ChatbotService) {
    }

    @Post('chat-completion')
    @UseGuards(AuthGuard)
    async createChatCompletion(
        @Req() request: Request & { user: { sub: string } },
        @Body() body: CreateChatCompletionDto) {
        const requesterId = request.user.sub;
        return this.chatbotService.createChatCompletion(requesterId, body.messages);
    };
}
