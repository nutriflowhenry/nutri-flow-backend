import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionWithRequest } from 'passport-auth0';
import { AuthService } from '../auth.service';
import { VerifyCallback } from 'jsonwebtoken';


@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
   constructor(private readonly authService: AuthService) {
      super({
         domain: process.env.AUTH0_DOMAIN,
         clientID: process.env.AUTH_CLIENT_ID,
         clientSecret: process.env.AUTH0_CLIENT_SECRET,
         callbackURL: process.env.AUTH0_CALLBACK_URL,
         passReqToCallback: true,
         authorizationParams: { scope: 'openid profile email' }
      } as StrategyOptionWithRequest);
   }

   async validate(accessToken: string,
                  refreshToken: string,
                  profile: any, done: VerifyCallback): Promise<void> {
      try {
         const auth0Id = profile.id;
         const email = profile.emails?.[0]?.value;
         const name = profile.displayName;

         const { user } = await this.authService.validateAuth0User(auth0Id, email, name);
         return done(null, user);

      } catch (error) {
         return done(error, null);
      }
   }
}