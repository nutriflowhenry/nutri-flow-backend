import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { SubscriptionStatus } from '../enums/suscriptionStatus.enum';

export class CreatePaymentDto {
  stripeSubscriptionId: string;

  status: SubscriptionStatus;

  user: User;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;
}
