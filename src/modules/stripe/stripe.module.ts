import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeProvider } from 'src/config/stripe.config';
import { StripeController } from './stripe.controller';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [forwardRef(() => PaymentsModule)],
  providers: [StripeService, StripeProvider],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule implements OnModuleInit {
  constructor(private readonly stripeService: StripeService) {}

  async onModuleInit(): Promise<void> {
    const initialSuscriptionName: string = 'Plan premium';
    const suscriptionExists = await this.stripeService.getProductsByName(
      initialSuscriptionName,
    );

    if (!suscriptionExists.data.length) {
      const product = await this.stripeService.createProduct({
        name: initialSuscriptionName,
        description:
          'Acceso premium mensual con características exclusivas de Nutriflow',
        metadata: { type: 'premium' },
      });

      const price = await this.stripeService.createPrice({
        product: product.id,
        unit_amount: 1000,
        currency: 'usd',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        billing_scheme: 'per_unit',
      });
    }
    const suscriptionExistsCheck = await this.stripeService.getProductsByName(
      initialSuscriptionName,
    );
    if (suscriptionExistsCheck.data[0].name === initialSuscriptionName) {
      console.log(
        'Suscripción stripe disponible para usarse en pasarela de pagos',
      );
    } else {
      console.log('Problema al crear suscripción base de Stripe');
    }
  }
}
