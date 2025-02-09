import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { UserProfile } from './../../shared/interfaces/UserProfile';
import { constants } from '../../shared/constants';
import { FaceBookConfig } from 'src/shared/interfaces/AuthConfig';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, constants.facebook) {
  constructor(@Inject(constants.FACEBOOK_CONFIG) private readonly faceBookConfig: FaceBookConfig) {
    super(faceBookConfig);
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const state = req.query.state;
      const user: UserProfile = {
        providerUserId: profile.id,
        provider: profile.provider,
        profile: profile.name,
        email: profile.emails[0].value,
      };
      done(null, {user, state});
    } catch (e) {
      console.error({facebookStrategyError: e});
      done(e, false);
    }
  }
}
