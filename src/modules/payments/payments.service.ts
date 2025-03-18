import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';
import { GetPaymentDto } from './dto/get-payment.dto';
import { SubscriptionStatus } from './enums/suscriptionStatus.enum';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { TypedEventEmitter } from '../emitters/typed-event-emitter.class';
import { Subscribable, Subscription } from 'rxjs';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UsersService,
    private readonly paymentRepository: PaymentRepository,
    private readonly typedEventEmitter: TypedEventEmitter,
  ) {}
  async createCheckoutSession(userId: string) {
    const user: User = await this.userService.findById(userId);
    const activeSuscription: Payment =
      await this.paymentRepository.findActiveByUser(userId);
    if (activeSuscription) {
      throw new BadRequestException(
        `El usuario ${userId} ya tiene una suscripción activa`,
      );
    }
    let stripeCustomerId: string = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer: Stripe.Customer =
        await this.stripeService.createCustomer(user.email, user.name);
      stripeCustomerId = stripeCustomer.id;
      const updatedUser: User = await this.userService.addStripeId(
        stripeCustomerId,
        user.id,
      );
    }
    const checkoutSession =
      await this.stripeService.createCheckoutSession(stripeCustomerId);
    return {
      message: '\"Checkout Session\" creada exitosamente',
      url: checkoutSession.url,
    };
  }

  async cancelSubscriptionNow(userId: string) {
    const activeSuscription: Payment =
      await this.paymentRepository.findActiveByUser(userId);
    if (!activeSuscription) {
      throw new BadRequestException(
        `El usuario ${userId} no tiene una suscripción activa`,
      );
    }
    await this.stripeService.cancelSubscriptionNow(
      activeSuscription.stripeSubscriptionId,
    );

    return {
      message: `Se canceló exitosamente la suscripción del usuario ${userId}`,
    };
  }

  async getAllPaymentsByUser(userId: string, limit: number, page: number) {
    const allPayments = await this.paymentRepository.finAllByUser(
      userId,
      limit,
      page,
    );
    return {
      message: `Registros de pagos considerando estar en la página ${page} con ${limit} registros por cada página`,
      data: {
        result: allPayments.results,
        total: allPayments.total,
        page,
        limit,
        totalPages: Math.ceil(allPayments.total / limit),
      },
    };
  }

  async getAllPayments(getPaymentDto: GetPaymentDto) {
    const { page, limit } = getPaymentDto;
    const skip = (page - 1) * limit;
    const [result, totalPayments] = await this.paymentRepository.findAll(
      skip,
      limit,
    );
    const totalPages: number = Math.ceil(totalPayments / limit);

    return {
      message: 'Registros de pagos obtenidos exitosamente',
      data: result,
      pagination: {
        page,
        limit,
        totalPayments,
        totalPages,
      },
    };
  }

  async registerPayment(paymentData: Stripe.Subscription) {
    console.log('### Se inició el registro');
    const localRegisterPayment: Payment | null =
      await this.paymentRepository.findOneByStripeId(paymentData.id);
    console.log(`## registro local:${localRegisterPayment}`);

    if (!localRegisterPayment) {
      const stripeCustomerId: string = paymentData.customer.toString();
      const user: User =
        await this.userService.findByStripeId(stripeCustomerId);
      const isAvalidateStatus: boolean = Object.keys(
        SubscriptionStatus,
      ).includes(paymentData.status.toUpperCase());
      let statusEnum: SubscriptionStatus;
      if (isAvalidateStatus) {
        const statusString: string =
          paymentData.status.toUpperCase() as keyof typeof SubscriptionStatus;
        statusEnum = SubscriptionStatus[statusString];
      } else {
        statusEnum = SubscriptionStatus.UNEXPECTED;
      }
      const createPaymentData: CreatePaymentDto = {
        status: statusEnum,
        stripeSubscriptionId: paymentData.id,
        user,
        currentPeriodStart: new Date(paymentData.current_period_start * 1000),
        currentPeriodEnd: new Date(paymentData.current_period_end * 1000),
      };
      const registeredPayment: Payment =
        await this.paymentRepository.create(createPaymentData);
      console.log('### Se terminó el registro');
      return registeredPayment;
    }
  }

  async upsertPayment(paymentData: Stripe.Subscription) {
    const stripeCustomerId: string = paymentData.customer.toString();
    const user: User = await this.userService.findByStripeId(stripeCustomerId);
    const validatedStatus: SubscriptionStatus = this.mapStripeStatus(
      paymentData.status,
    );
    const createPaymentData: CreatePaymentDto = {
      status: validatedStatus,
      stripeSubscriptionId: paymentData.id,
      user,
      currentPeriodStart: new Date(paymentData.current_period_start * 1000),
      currentPeriodEnd: new Date(paymentData.current_period_end * 1000),
    };
    console.log(createPaymentData.status);
    const payment: Payment = await this.paymentRepository.upsert(
      paymentData.id,
      createPaymentData,
    );

    if (payment.status === SubscriptionStatus.ACTIVE) {
      await this.userService.updateSubscriptionType(user.id);
      this.typedEventEmitter.emitAsync('premium.subscription.created', {
        email: user.email,
        name: user.name,
        subscription: payment,
      });
    } else {
      const activeSuscription: Payment =
        await this.paymentRepository.findActiveByUser(user.id);
      if (!activeSuscription) {
        await this.userService.downgradeSubscriptionType(user.id);
      }
    }
  }

  async subscriptiondowngrade(paymentData: Stripe.Subscription) {
    if (!paymentData.id) return;
    const payment: Payment = await this.paymentRepository.findOneByStripeId(
      paymentData.id,
    );
    console.log(payment);
    if (!payment) return;
    const paymentCancelData: UpdatePaymentDto = {
      status: SubscriptionStatus.CANCELED,
      canceled_at: new Date(),
    };
    await this.paymentRepository.update(payment.id, paymentCancelData);
    const consumerId: string = paymentData.customer.toString();
    const user: User = await this.userService.findByStripeId(consumerId);
    await this.userService.downgradeSubscriptionType(user.id);
  }

  async handleSubscriptionInvoicePaid(invoiceObject: Stripe.Invoice) {
    if (invoiceObject.subscription) {
      const subscriptionStripeId: string =
        invoiceObject.subscription.toString();
      const subscriptionStripeData: Stripe.Subscription =
        await this.stripeService.getSuscriptionData(subscriptionStripeId);
      const payment: Payment | null =
        await this.paymentRepository.findOneByStripeId(subscriptionStripeId);
      if (payment) {
        const updateData: UpdatePaymentDto = {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(
            subscriptionStripeData.current_period_start * 1000,
          ),
          currentPeriodEnd: new Date(
            subscriptionStripeData.current_period_end * 1000,
          ),
        };
        await this.paymentRepository.update(payment.id, updateData);
      }
    }
  }

  async handleInvoicePaymentFailed(invoiceObject: Stripe.Invoice) {
    if (invoiceObject.subscription) {
      const subscriptionStripeId: string =
        invoiceObject.subscription.toString();
      const subscriptionStripeData: Stripe.Subscription =
        await this.stripeService.getSuscriptionData(subscriptionStripeId);

      const stripeCustomerId: string =
        subscriptionStripeData.customer.toString();
      const user: User =
        await this.userService.findByStripeId(stripeCustomerId);
      const validatedStatus: SubscriptionStatus = this.mapStripeStatus(
        subscriptionStripeData.status,
      );
      const createPaymentData: CreatePaymentDto = {
        status: validatedStatus,
        stripeSubscriptionId: subscriptionStripeData.id,
        user,
        currentPeriodStart: new Date(
          subscriptionStripeData.current_period_start * 1000,
        ),
        currentPeriodEnd: new Date(
          subscriptionStripeData.current_period_end * 1000,
        ),
      };
      console.log(createPaymentData.status);
      const payment: Payment = await this.paymentRepository.upsert(
        subscriptionStripeData.id,
        createPaymentData,
      );
    }
  }

  private mapStripeStatus(stripeStatus: string): SubscriptionStatus {
    const statusKey =
      stripeStatus.toUpperCase() as keyof typeof SubscriptionStatus;
    return SubscriptionStatus[statusKey] || SubscriptionStatus.UNEXPECTED;
  }
}
