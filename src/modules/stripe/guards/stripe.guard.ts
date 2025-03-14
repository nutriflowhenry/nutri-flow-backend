import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  constructor(@Inject('STRIPE_API_KEY') private readonly stripe: Stripe) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers['stripe-signature'];

    try {
      const event = this.stripe.webhooks.constructEvent(
        (request as any).rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      // Adjuntar el evento validado a la request
      request['stripeEvent'] = event;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Firma de webhook inválida');
    }
  }
}
