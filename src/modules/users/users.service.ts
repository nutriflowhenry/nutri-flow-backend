import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from "./users.repository";
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/public-user.dto';

@Injectable()
export class UsersService {
   constructor(private usersRepository: UsersRepository) {
   }

   create(createUserDto: CreateUserDto) {
      return 'This action adds a new user';
   }

   async findAll(): Promise<PublicUserDto[]> {
      const users = await this.usersRepository.findAll();
      return plainToInstance(PublicUserDto, users)
   }

   findOne(id: number) {
      return `This action returns a #${id} user`;
   }

   update(id: number, updateUserDto: UpdateUserDto) {
      return `This action updates a #${id} user`;
   }

   remove(id: number) {
      return `This action removes a #${id} user`;
   }
}
