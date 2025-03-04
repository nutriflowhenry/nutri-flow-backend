import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLocalUserDto } from '../users/dto/create-local-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { PublicUserDto } from '../users/dto/public-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() userData: CreateLocalUserDto): Promise<PublicUserDto> {
    console.log(userData);
    return this.authService.signUp(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: LoginUserDto) {
    return this.authService.logIn(credentials);
  }

  @Post('google')
  googleAuth(@Body('token') token: string) {
    return this.authService.authenticateWithGoogle(token);
  }
}
