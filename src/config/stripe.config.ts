import { Provider } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import Stripe from 'stripe';

dotenvConfig({ path: '.env' });

export const StripeProvider: Provider = {
  provide: 'STRIPE_API_KEY',
  useFactory: async () => {
    return new Stripe(process.env.STRIPE_API_KEY);
  },
};
