import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_API_KEY') private readonly stripe: Stripe) {}
  initialSuscriptionName: string = 'Plan premium';

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({ email, name });
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async createCheckoutSession(stripeCustomerId: string) {
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresAt = currentTime + 1800;
    try {
      const subscriptions = await this.getProductsByName(
        this.initialSuscriptionName,
      );
      const baseSubscriptionPriceId: string =
        subscriptions.data[0].default_price.toString();
      return await this.stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: baseSubscriptionPriceId, quantity: 1 }],
        success_url: 'http://localhost:3000/payment-success',
        cancel_url: 'http://localhost:3000/payment-success',
        expires_at: expiresAt,
      });
    } catch (error) {
      console.log('Error al crear la oden de pago', error.stack);
      throw error;
    }
  }

  async cancelSubscriptionNow(subscriptionId: string) {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      throw error;
    }
  }

  async getSuscriptionData(subscriptionId: string) {
    try {
      return this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {}
  }

  async getProductsByName(initialSuscriptionName: string) {
    try {
      return this.stripe.products.search({
        query: `name:'${initialSuscriptionName}' AND active:'true'`,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createProduct(productData: Stripe.ProductCreateParams) {
    try {
      return this.stripe.products.create(productData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createPrice(priceData: Stripe.PriceCreateParams) {
    try {
      return this.stripe.prices.create(priceData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
