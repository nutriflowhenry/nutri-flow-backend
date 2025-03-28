import { Payment } from '../payments/entities/payment.entity';

export interface EventPayloads {
  'user.registered': { name: string; email: string };
  'premium.subscription.created': {
    name: string;
    email: string;
    subscription: Payment;
    timeZone: string;
  };
  'user.reminders': {
    userId: string;
    name: string;
    email: string;
    waterGoal: number;
    caloriesGoal: number;
    timeZone: string;
  };
}
