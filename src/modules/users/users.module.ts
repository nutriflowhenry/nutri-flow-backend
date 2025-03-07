import { Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudFrontService } from '../images/aws/CloudFront.service';

@Module({
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, UsersRepository, CloudFrontService],
    exports: [UsersRepository, UsersService],
})
export class UsersModule implements OnModuleInit {
    constructor(private readonly usersService: UsersService) {
    }

    async onModuleInit(): Promise<void> {
        const adminExists = await this.usersService.checkIfAdminExists();

        if (adminExists) {
            console.log('Admin already exists, skipping creation');
            return;
        }

        await this.usersService.createAdmin({
            name: 'Admin',
            email: 'admin@mail.com',
            password: 'Password123!'
        });
    }
}

