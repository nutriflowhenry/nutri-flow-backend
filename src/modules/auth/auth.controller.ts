import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {
   }

   @Post('signup')
   @HttpCode(HttpStatus.CREATED)
   signUp(@Body() userData: CreateLocalUserDto) {
      return this.authService.signUp(userData);
   }

   @Post('login')
   @HttpCode(HttpStatus.OK)
   login(@Body() credentials: LoginUserDto) {
      return this.authService.logIn(credentials);
   }
}