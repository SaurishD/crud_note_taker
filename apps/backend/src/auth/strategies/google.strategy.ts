import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { StrategyOptions } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
      throw new Error('Google OAuth environment variables are not properly configured');
    }

    super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['email', 'profile'],
        passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {

    console.log("AccessToken",accessToken)
    console.log("Profile", profile)
    if (!profile || !profile.emails || !profile.emails[0]) {
        console.log("Login failed")
        return
    }
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      accessToken,
    };
    
    const appUser = await this.authService.validateUser(user.email);
    done(null, appUser);
  }
}