import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { CreateAuth0UserDto } from './dto/create-auth0-user.dto';
import { AuthProvider } from './enums/auth-provider.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/enums/roles.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { SubscriptionType } from './enums/subscription-type.enum';


@Injectable()
export class UsersRepository {

    constructor(@InjectRepository(User) private repository: Repository<User>) {
    }

    async createAdmin(adminData: CreateAdminDto) {
        await this.repository.save({
            ...adminData,
            password: await bcrypt.hash(adminData.password, 10),
            role: Role.ADMIN
        });
    }


    async createLocalUser(userData: Omit<CreateLocalUserDto, 'passwordConfirmation'>): Promise<User> {
        return this.repository.save(userData);
    }


    async createAuth0User(userData: CreateAuth0UserDto): Promise<User> {
        return this.repository.save({ ...userData, provider: AuthProvider.AUTH0 });
    }


    async findAll(): Promise<User[]> {
        return this.repository.find();
    }


    async findAllWithNotificationsEnabled(): Promise<User[]> {
        return this.repository.find({
            where: { notifications: true }
        });
    }


    async findById(id: string): Promise<User> {
        return this.repository.findOne({
            where: { id },
            relations: { userProfile: true },
        });
    }


    async findByAuthId(auth0Id: string): Promise<User> {
        return this.repository.findOneBy({ auth0Id });
    }


    async findByEmail(email: string): Promise<User> {
        return this.repository.findOneBy({ email });
    }


    async update(id: string, updateData: UpdateUserDto): Promise<User> {
        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('No update data provided');
        }

        const updatedFields = { ...updateData };

        if (updatedFields.password) {
            updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
        }

        await this.repository.update(id, updatedFields);

        console.log(`User with ID ${id} has been updated`);
        return this.repository.findOneBy({ id });
    }


    async deactivateUser(id: string): Promise<void> {
        await this.repository.update(id, { isActive: false });
        console.log(`User with ID ${id} has been deactivated`);
    }


    async banUser(id: string): Promise<void> {
        await this.repository.update(id, { isActive: false });
        console.log(`User with ID ${id} has been banned`);
    }


    async unbanUser(id: string): Promise<void> {
        await this.repository.update(id, { isActive: true });
        console.log(`User with ID ${id} has been unbanned`);

    }


    async checkIfAdminExists(): Promise<boolean> {
        const admin = await this.repository.findOneBy({ role: Role.ADMIN });
        return !!admin;
    }


    async findByStripeId(stripeCustomerId: string): Promise<User> {
        return await this.repository.findOne({
            where: { stripeCustomerId },
        });
    }


    async addStripeId(stripeId: string, userId: string): Promise<User> {
        await this.repository.update(userId, { stripeCustomerId: stripeId });
        return this.repository.findOne({ where: { id: userId } });
    }


    async updateSubscriptionType(userId: string): Promise<void> {
        await this.repository.update(userId, {
            subscriptionType: SubscriptionType.PREMIUM,
        });
    }

    async downgradeSubscriptionType(userId: string): Promise<void> {
        await this.repository.update(userId, {
            subscriptionType: SubscriptionType.FREE,
        });
    }
}