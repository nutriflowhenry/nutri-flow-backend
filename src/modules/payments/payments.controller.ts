import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetPaymentDto } from './dto/get-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createCheckoutSession(@Req() req: { user: { sub: string } }) {
    const userId: string = req.user.sub;
    return this.paymentsService.createCheckoutSession(userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllPaymentsByUser(
    @Req() req: { user: { sub: string } },
    @Query() getPaymentData: GetPaymentDto,
  ) {
    const userId: string = req.user.sub;
    const limit: number = getPaymentData.limit;
    const page: number = getPaymentData.page;
    return this.paymentsService.getAllPaymentsByUser(userId, limit, page);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async cancelSubscriptionNow(@Req() req: { user: { sub: string } }) {
    const userId: string = req.user.sub;
    return this.paymentsService.cancelSubscriptionNow(userId);
  }
}
