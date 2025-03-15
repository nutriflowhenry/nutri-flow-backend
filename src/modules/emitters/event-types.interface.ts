import { Payment } from '../payments/entities/payment.entity';

export interface EventPayloads {
  'user.registered': { name: string; email: string };
  'premium.subscription.created': {
    name: string;
    email: string;
    subscription: Payment;
  };
}
