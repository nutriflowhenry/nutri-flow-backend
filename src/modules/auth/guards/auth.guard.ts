import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwksClient from 'jwks-rsa';


@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private readonly jwtService: JwtService) {
   }

   canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      const authHeader = request.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer '))
         throw new UnauthorizedException('Bearer token missing or invalid');

      const token = authHeader.split(' ')[1];

      try {
         const secret = process.env.JWT_SECRET;
         const tokenPayload = this.jwtService.verify(token, { secret });

         tokenPayload.iat = new Date(tokenPayload.iat * 1000).toLocaleString('es');
         tokenPayload.exp = new Date(tokenPayload.exp * 1000).toLocaleString('es');

         console.log({ tokenPayload });
         request.user = tokenPayload;

         return true;

      } catch (error) {
         throw new UnauthorizedException('Invalid token');
      }
   }
}
