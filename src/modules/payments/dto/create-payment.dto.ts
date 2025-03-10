import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class CreatePaymentDto {
  stripeSubscriptionId: string;

  isActive: boolean;

  user: User;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;
}
