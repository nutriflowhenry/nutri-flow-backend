import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '../aws/aws.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserReview } from './submodules/user-review/entities/user-review.entity';
import { UsersReviewRepository } from './submodules/user-review/user-review.repository';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserReview]),
    AwsModule,
    forwardRef(() => NotificationsModule),
  ],
  providers: [UsersService, UsersRepository, UsersReviewRepository],
  exports: [UsersRepository, UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    const adminExists = await this.usersService.checkIfAdminExists();

    if (adminExists) {
      console.log('Admin already exists, skipping creation');
      return;
    }

    await this.usersService.createAdmin({
      name: 'Admin',
      email: 'admin@mail.com',
      password: 'Password123!',
    });
  }
}
