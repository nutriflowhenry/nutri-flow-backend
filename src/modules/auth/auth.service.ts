import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { OAuth2Client } from 'google-auth-library';


@Injectable()
export class AuthService {
   private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

      const jwt = this.jwtService.sign(userPayload);

      return {
         token: jwt,
         userId: userPayload.sub,
         userName: userPayload.name,
         email: userPayload.email,
      };
   }


   async authenticateWithGoogle(token: string) {
      const googleUser = await this.verifyGoogleToken(token);
      if (!googleUser) throw new UnauthorizedException('Google authentication failed');

      let user = await this.usersRepository.findByEmail(googleUser.email);
      if (!user) {
         user = await this.usersRepository.createAuth0User({
            name: googleUser.given_name,
            email: googleUser.email,
            auth0Id: googleUser.sub
         });
      }

      const payload = {
         sub: user.id,
         name: user.name,
         email: user.email,
         role: user.role
      };

      console.log({ payload });

      const jwt = this.jwtService.sign(payload);

      return {
         token: jwt,
         userId: payload.sub,
         userName: payload.name,
         email: payload.email,
      };
   }


   async verifyGoogleToken(token: string) {
      try {
         const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
         });

         return ticket.getPayload();

      } catch (error) {
         throw new UnauthorizedException('Invalid Google Token');
      }
   }
}