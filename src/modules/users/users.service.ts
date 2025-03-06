import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class UsersService {
   constructor(private usersRepository: UsersRepository) {
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
}
