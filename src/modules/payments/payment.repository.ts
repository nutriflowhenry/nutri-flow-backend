import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { SubscriptionStatus } from './enums/suscriptionStatus.enum';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment) private PaymentRepository: Repository<Payment>,
  ) {}

  async findOneByStripeId(paymentStripeId: string): Promise<Payment> {
    return this.PaymentRepository.findOne({
      where: { stripeSubscriptionId: paymentStripeId },
    });
  }

  async create(paymentdata: CreatePaymentDto): Promise<Payment> {
    const newPayment: Payment = this.PaymentRepository.create(paymentdata);
    return this.PaymentRepository.save(newPayment);
  }

  async update(paymentId: string, updateData: UpdatePaymentDto): Promise<void> {
    await this.PaymentRepository.update(paymentId, updateData);
  }

  async findActiveByUser(userId: string): Promise<Payment | null> {
    return await this.PaymentRepository.findOne({
      where: {
        user: { id: userId },
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  async finAllByUser(userId: string, limit: number, page: number) {
    const [results, total] = await this.PaymentRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      order: {
        created_at: 'DESC',
        id: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results,
      total,
    };
  }

  async findAll(skip: number, limit: number): Promise<[Payment[], number]> {
    const result: [Payment[], number] =
      await this.PaymentRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.user', 'user')
        .select([
          'payment',
          'user.id',
          'user.name',
          'user.subscriptionType',
          'user.isActive',
        ])
        .orderBy('payment.created_at', 'DESC')
        .addOrderBy('payment.id', 'ASC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();
    return result;
  }
}
