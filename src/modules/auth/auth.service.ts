import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
   constructor(
      private usersRepository: UsersRepository,
      private jwtService: JwtService) {
   }

   async signUp(userData: CreateUserDto): Promise<PublicUserDto> {
      const dbUser = await this.usersRepository.findByEmail(userData.email)
      if (dbUser) throw new BadRequestException('Email already exists');

      const { passwordConfirmation, ...filteredData } = userData;

      const newUser = this.usersRepository.createUser({
         ...filteredData,
         password: await bcrypt.hash(userData.password, 10)
      })

      return plainToInstance(PublicUserDto, newUser)
   }

   async logIn(credentials: LoginUserDto) {
      const user = await this.usersRepository.findByEmail(credentials.email);
      if (!user) throw new BadRequestException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

      const userPayload = {
         sub: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
      }

      console.log({ userPayload });

      const token = this.jwtService.sign(userPayload);

      return {
         message: `El usuario ${user.id} ha iniciado sesión`,
         role: userPayload.role,
         token,
      }
   }
}