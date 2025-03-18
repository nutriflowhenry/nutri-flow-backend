import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateChatCompletionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatCompletionMessageDto)
    messages: ChatCompletionMessageDto[];
}


export class ChatCompletionMessageDto {
    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}