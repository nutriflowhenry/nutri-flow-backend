import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionStatus } from '../enums/suscriptionStatus.enum';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stripeSubscriptionId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.INCOMPLETE,
  })
  status: SubscriptionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  currentPeriodStart: Date;

  @Column({ type: 'timestamptz' })
  currentPeriodEnd: Date;

  @Column({ type: 'date', nullable: true })
  canceled_at: Date;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;
}
