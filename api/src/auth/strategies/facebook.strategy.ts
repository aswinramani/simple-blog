import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ['id', 'name', 'email', 'picture'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
      providerId: profile.id,
      firstName: profile.displayName,
      provider: profile.provider,
      accessToken,
    };
    done(null, user);
  }
}
