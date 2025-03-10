import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WaterTrackerModule } from './modules/water-tracker/water-tracker.module';
import { FoodTrackerModule } from './modules/food-tracker/food-tracker.module';
import typeOrmConfig from './config/typeOrm.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsModule } from './modules/payments/payments.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { StripeWebhookMiddleware } from './modules/stripe/middleware/stripe.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthModule,
    UsersModule,
    WaterTrackerModule,
    FoodTrackerModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    StripeModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StripeWebhookMiddleware).forRoutes('stripe/webhook');
  }
}
