import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { UserProfile } from '../../shared/interfaces/UserProfile';
import { constants } from '../../shared/constants';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleConfig } from '../../shared/interfaces/AuthConfig';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, constants.google) {
  constructor(@Inject(constants.GOOGLE_CONFIG) private readonly googleConfig: GoogleConfig) {
    super(googleConfig);
  }
  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const state = req.query.state;
      const user: UserProfile = {
        providerUserId: profile.id,
        provider: profile.provider,
        profile: profile.name,
        email: profile.emails[0].value
      };
      done(null, {user, state});
    } catch (e) {
      console.error({googleStrategyError: e});
      done(e, false);
    }
  }
};