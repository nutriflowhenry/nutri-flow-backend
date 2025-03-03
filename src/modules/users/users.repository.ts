import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { CreateAuth0UserDto } from './dto/create-auth0-user.dto';
import { AuthProvider } from './enums/auth-provider.enum';

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
         relations: ['profile'],
      });
   }

   async findByAuthId(auth0Id: string): Promise<User> {
      return this.repository.findOneBy({ auth0Id });
   }

   async findByEmail(email: string): Promise<User> {
      return this.repository.findOneBy({ email });
   }
}