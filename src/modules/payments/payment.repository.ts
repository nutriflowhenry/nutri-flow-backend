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
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async findOneByStripeId(paymentStripeId: string): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { stripeSubscriptionId: paymentStripeId },
    });
  }

  async create(paymentdata: CreatePaymentDto): Promise<Payment> {
    const newPayment: Payment = this.paymentRepository.create(paymentdata);
    return this.paymentRepository.save(newPayment);
  }

  async update(paymentId: string, updateData: UpdatePaymentDto): Promise<void> {
    await this.paymentRepository.update(paymentId, updateData);
  }

  async upsert(id: string, paymentData: CreatePaymentDto) {
    const result = await this.paymentRepository.upsert(paymentData, [
      'stripeSubscriptionId',
    ]);
    return this.findOneByStripeId(id);
  }

  async findActiveByUser(userId: string): Promise<Payment | null> {
    return await this.paymentRepository.findOne({
      where: {
        user: { id: userId },
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  async finAllByUser(userId: string, limit: number, page: number) {
    const [results, total] = await this.paymentRepository.findAndCount({
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
    const result: [Payment[], number] = await this.paymentRepository
      .createQueryBuilder('payment')
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
