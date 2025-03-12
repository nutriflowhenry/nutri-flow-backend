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
      case 'customer.subscription.created': {
        await this.paymentService.registerPayment(event.data.object);
        break;
      }
      // case 'customer.subscription.updated': {
      //   await this.paymentService.updatePayment(event.data.object, event.data);
      //   break;
      // }
      case 'customer.subscription.deleted': {
        await this.paymentService.subscriptiondowngrade(event.data.object);
        break;
      }
      case 'invoice.paid': {
        await this.paymentService.handleSubscriptionInvoicePaid(
          event.data.object,
        );
        break;
      }
      // case 'customer.subscription.created': {
      //   const subscription = event.data.object as Stripe.Subscription;

      //   // Verificar si ya existe en tu DB (idempotencia)
      //   const exists = await this.subscriptionRepo.findOneBy({
      //     stripeSubscriptionId: subscription.id
      //   });

      //   if (!exists) {
      //     await this.subscriptionRepo.save({
      //       stripeSubscriptionId: subscription.id,
      //       status: subscription.status,
      //       user: await this.getUserFromCustomerId(subscription.customer),
      //       currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      //     });

      //     // Enviar email de bienvenida
      //     this.emailService.sendSubscriptionConfirmation(
      //       subscription.customer.toString()
      //     );
      //   }
      //   break;
      // }
      default: {
        console.log(`Evento del tipo ${event.type}, no manejado`);
      }
    }

    return { received: true };
  }
}
