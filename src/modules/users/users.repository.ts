import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { CreateAuth0UserDto } from './dto/create-auth0-user.dto';
import { AuthProvider } from './enums/auth-provider.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
   constructor(@InjectRepository(User) private repository: Repository<User>) {
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


   async update(id: string, updateData: UpdateUserDto) {
      if (Object.keys(updateData).length === 0) {
         throw new BadRequestException('No update data provided');
      }

      await this.repository.update(id, updateData);
      const updatedUser = await this.repository.findOneBy({ id });

      console.log(`User with ID ${id} has been updated`);
      return updatedUser;
   }


   async delete(id: string): Promise<void> {
      await this.repository.delete(id);
      console.log(`User with ID ${id} has been deleted`);
   }
}