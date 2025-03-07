import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { S3Service } from '../images/aws/s3-service';
import { CloudFrontService } from '../images/aws/cloud-front.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly cloudFrontService: CloudFrontService,
        private readonly usersRepository: UsersRepository,
        private readonly s3Service: S3Service) {
    }


    async createAdmin(adminData: CreateAdminDto): Promise<void> {
        return this.usersRepository.createAdmin(adminData);
    }


    async findAll(): Promise<PublicUserDto[]> {
        const users = await this.usersRepository.findAll();
        return plainToInstance(PublicUserDto, users);
    }


    async findById(id: string): Promise<User> {
        return this.usersRepository.findById(id);
    }


    async findOne(id: string): Promise<PublicUserDto> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);

        if (user?.profilePicture) {
            user.profilePicture = this.cloudFrontService.generateSignedUrl(user.profilePicture);
        }

        return plainToInstance(PublicUserDto, user);
    }


    async update(id: string, updateData: UpdateUserDto): Promise<PublicUserDto> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);

        const updatedUser = await this.usersRepository.update(id, updateData);
        return plainToInstance(PublicUserDto, updatedUser);
    }


    async deactivateAccount(id: string): Promise<void> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);

        if (!user.isActive) {
            throw new ConflictException(`User with ID ${id} is already deactivated`);
        }

        await this.usersRepository.deactivateUser(id);
    }


    async banUser(id: string): Promise<void> {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);

        if (!user.isActive) {
            throw new ConflictException(`User with ID ${id} is already deactivated`);
        }

        await this.usersRepository.banUser(id);
    }


    async checkIfAdminExists(): Promise<boolean> {
        return this.usersRepository.checkIfAdminExists();
    }


    async getImageUploadUrl(userId: string, fileType: string): Promise<string> {
        return this.s3Service.generateUploadUrl(userId, 'profile', fileType);
    }


    async updateProfilePicture(userId: string, fileType: string): Promise<void> {
        const filePath = `profile-pictures/${userId}.${fileType}`;
        await this.update(userId, { profilePicture: filePath });
    }
}
