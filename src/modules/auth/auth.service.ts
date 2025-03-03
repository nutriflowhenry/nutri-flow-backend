import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { CreateAuth0UserDto } from '../users/dto/create-auth0-user.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
   constructor(
      private usersRepository: UsersRepository,
      private jwtService: JwtService) {
   }

   async signUp(userData: CreateLocalUserDto): Promise<PublicUserDto> {
      const dbUser = await this.usersRepository.findByEmail(userData.email);
      if (dbUser) throw new BadRequestException('Email already exists');

      const { passwordConfirmation, ...filteredData } = userData;

      const newUser = this.usersRepository.createLocalUser({
         ...filteredData,
         password: await bcrypt.hash(userData.password, 10)
      });

      return plainToInstance(PublicUserDto, newUser);
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
      };

      console.log({ userPayload });

      const token = this.jwtService.sign(userPayload);

      return {
         message: `El usuario ${user.id} ha iniciado sesión`,
         role: userPayload.role,
         token,
      };
   }

   async validateAuth0User(email: string, auth0Id: string, name: string) {
      let user = await this.usersRepository.findByAuthId(auth0Id);
      if (!user) user = await this.usersRepository.createAuth0User({ auth0Id, email, name });

      const payload = {
         sub: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
      };

      console.log({ payload });

      return {
         user,
         access_token: this.jwtService.sign(payload)
      };
   }

   async exchangeCodeForToken(code: any) {
      console.log('Request body:', {
         grant_type: 'authorization_code',
         client_id: process.env.AUTH0_CLIENT_ID,
         client_secret: process.env.AUTH0_CLIENT_SECRET,
         redirect_uri: process.env.AUTH0_CALLBACK_URL,
         code,
      });

      const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
         grant_type: 'authorization_code',
         client_id: process.env.AUTH0_CLIENT_ID,
         client_secret: process.env.AUTH0_CLIENT_SECRET,
         redirect_uri: process.env.AUTH0_CALLBACK_URL,
         code
      });

      console.log(response.data);
      return response.data; // { access_token, id_token, ... }
   }

   async fetchUserProfile(accessToken: any) {
      const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
         headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response.data);
      return response.data; // { sub, email, name, ... }
   }
}