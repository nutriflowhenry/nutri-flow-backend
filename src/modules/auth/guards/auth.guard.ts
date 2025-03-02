import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwksClient from 'jwks-rsa';
import { promisify } from 'util';

@Injectable()
export class AuthGuard implements CanActivate {
   private jwksClient = jwksClient({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
   });

   // private auth0JwksClient = jwksClient({
   //    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
   // });
   //
   // private googleJwksClient = jwksClient({
   //    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
   // });

   constructor(private readonly jwtService: JwtService) {
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw new UnauthorizedException('Bearer token is missing or invalid');
      }

      const token = authHeader.split(' ')[1];

      const decodedToken = this.jwtService.decode(token, { complete: true }) as {
         header?: { kid?: string };
         payload?: { iss?: string }
      };

      if (!decodedToken?.payload?.iss) {
         throw new UnauthorizedException('Invalid token: missing issuer');
      }

      try {
         let secretOrPublicKey: string;

         if (decodedToken.payload.iss.includes('auth0.com')) {
            const getKey = promisify(this.jwksClient.getSigningKey);
            const key = await getKey(decodedToken.header.kid);
            secretOrPublicKey = key.getPublicKey();

         } else {
            secretOrPublicKey = process.env.JWT_SECRET_KEY;
         }

         const tokenPayload = this.jwtService.verify(token, { secret: secretOrPublicKey });

         console.log({
            tokenPayload,
            issuedAt: new Date(tokenPayload.iat * 1000).toLocaleString(),
            expiresAt: new Date(tokenPayload.exp * 1000).toLocaleString(),
         });

         request.user = tokenPayload;
         return true;

      } catch (error) {
         throw new UnauthorizedException(`Invalid token: ${error.message}`);
      }
   }
}