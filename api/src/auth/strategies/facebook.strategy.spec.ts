import { Test, TestingModule } from '@nestjs/testing';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { FacebookStrategy } from './facebook.strategy';
import { constants } from '../../shared/constants';
import { FaceBookConfig } from 'src/shared/interfaces/AuthConfig';
import { UserProfile } from './../../shared/interfaces/UserProfile';

describe('FacebookStrategy', () => {
  let facebookStrategy: FacebookStrategy;

  const mockFaceBookConfig: FaceBookConfig = {
    clientID: 'testClientID',
    clientSecret: 'testClientSecret',
    callbackURL: 'testCallbackURL',
    profileFields: ['id', 'name', 'emails'],
    passReqToCallback: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacebookStrategy,
        {
          provide: constants.FACEBOOK_CONFIG,
          useValue: mockFaceBookConfig,
        },
      ],
    }).compile();

    facebookStrategy = module.get<FacebookStrategy>(FacebookStrategy);
  });

  it('should be defined', () => {
    expect(facebookStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user profile', async () => {
      const mockReq = { query: { state: 'testState' } };
      const mockAccessToken = 'testAccessToken';
      const mockRefreshToken = 'testRefreshToken';
      const mockProfile = {
        id: 'testId',
        provider: 'facebook',
        name: { givenName: 'Test', familyName: 'User' },
        emails: [{ value: 'test@example.com' }],
      };
      const done: VerifyCallback = jest.fn();

      const result = await facebookStrategy.validate(
        mockReq,
        mockAccessToken,
        mockRefreshToken,
        mockProfile,
        done,
      );

      const expectedUser: UserProfile = {
        providerUserId: 'testId',
        provider: 'facebook',
        profile: { givenName: 'Test', familyName: 'User' },
        email: 'test@example.com',
      };

      expect(done).toHaveBeenCalledWith(null, { user: expectedUser, state: 'testState' });
    });

    it('should handle errors', async () => {
      const mockReq = { query: { state: 'testState' } };
      const mockAccessToken = 'testAccessToken';
      const mockRefreshToken = 'testRefreshToken';
      const mockProfile = null;
      const done: VerifyCallback = jest.fn();

      jest.spyOn(console, 'error').mockImplementation(() => {});

      try {
        await facebookStrategy.validate(
          mockReq,
          mockAccessToken,
          mockRefreshToken,
          mockProfile,
          done,
        );
      } catch (e) {
        expect(console.error).toHaveBeenCalledWith({ facebookStrategyError: e });
        expect(done).toHaveBeenCalledWith(e, false);
      }
    });
  });
});
