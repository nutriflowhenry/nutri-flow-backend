import {
  Controller,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from '../payments/payments.service';
import { StripeWebhookGuard } from './guards/stripe.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly paymentService: PaymentsService) {}

  @UseGuards(StripeWebhookGuard)
  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const event = req['stripeEvent'] as Stripe.Event;
    switch (event.type) {
      case 'customer.subscription.updated': {
        console.log('Llegó a update');
        await this.paymentService.upsertPayment(event.data.object);
        break;
      }
      case 'customer.subscription.deleted': {
        console.log('Llegó a eliminación');
        await this.paymentService.subscriptiondowngrade(event.data.object);
        break;
      }
      case 'invoice.paid': {
        await this.paymentService.handleSubscriptionInvoicePaid(
          event.data.object,
        );
        break;
      }
      case 'invoice.payment_failed': {
        await this.paymentService.handleInvoicePaymentFailed(event.data.object);
        break;
      }
      default: {
        console.log(`Evento del tipo ${event.type}, no manejado`);
      }
    }
    return { received: true };
  }
}
