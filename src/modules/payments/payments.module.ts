import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeModule } from '../stripe/stripe.module';
import { UsersModule } from '../users/users.module';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [
    forwardRef(() => StripeModule),
    UsersModule,
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
