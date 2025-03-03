import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
   constructor(private usersRepository: UsersRepository) {
   }

   // create(createUserDto: CreateLocalUserDto) {
   //    return 'This action adds a new user';
   // }


   async findAll(): Promise<PublicUserDto[]> {
      const users = await this.usersRepository.findAll();
      return plainToInstance(PublicUserDto, users);
   }


   async findById(id: string): Promise<User> {
      return this.usersRepository.findById(id);
   }


   async findOne(id: string, requesterId: string): Promise<PublicUserDto> {
      if (id !== requesterId) {
         throw new ForbiddenException('You are not authorized to access this account');
      }

      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);


      return plainToInstance(PublicUserDto, user);
   }


   async update(id: string, requesterId: string, updateData: UpdateUserDto): Promise<User> {
      if (id !== requesterId) {
         throw new ForbiddenException(`You are not authorized to update this account`);
      }

      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return this.usersRepository.update(id, updateData);
   }


   async remove(id: string, requesterId: string): Promise<void> {
      if (id !== requesterId) {
         throw new ForbiddenException(`You are not authorized to delete this account`);
      }

      const user = await this.usersRepository.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      await this.usersRepository.delete(id);
   }
}
