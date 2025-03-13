import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.emailService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
        return this.emailService.update(+id, updateEmailDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.emailService.remove(+id);
    }
}
