import {
   BadRequestException,
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Post,
   Query,
   Req,
   UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {
   }

   @Post('signup')
   @HttpCode(HttpStatus.CREATED)
   signUp(@Body() userData: CreateLocalUserDto) {
      console.log(userData);
      return this.authService.signUp(userData);
   }

   @Post('login')
   @HttpCode(HttpStatus.OK)
   login(@Body() credentials: LoginUserDto) {
      return this.authService.logIn(credentials);
   }

   @Get('auth0/callback')
   async auth0Login(@Query('code') code: string) {
      if (!code) throw new BadRequestException('Authorization code is required');

      // Exchange code for Auth0 access token
      console.log('Authorization code:', code);
      const { access_token } = await this.authService.exchangeCodeForToken(code);

      //  Fetch user profile from Auth0
      const auth0User = await this.authService.fetchUserProfile(access_token);

      // Validate and issue JWT
      return this.authService.validateAuth0User(auth0User.email, auth0User.sub, auth0User.name);
   }
}