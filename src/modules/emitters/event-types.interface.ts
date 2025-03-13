import { Payment } from '../payments/entities/payment.entity';

export interface EventPayloads {
  'user.welcome': { name: string; email: string };
  'premium.subscription.congrats': {
    name: string;
    email: string;
    subscription: Payment;
  };
}
