import { Test, TestingModule } from '@nestjs/testing';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleStrategy } from './google.strategy';
import { constants } from '../../shared/constants';
import { GoogleConfig } from '../../shared/interfaces/AuthConfig';
import { UserProfile } from '../../shared/interfaces/UserProfile';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;

  const mockGoogleConfig: GoogleConfig = {
    clientID: 'testClientID',
    clientSecret: 'testClientSecret',
    callbackURL: 'testCallbackURL',
    scope: ['email', 'profile'],
    passReqToCallback: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: constants.GOOGLE_CONFIG,
          useValue: mockGoogleConfig,
        },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('should be defined', () => {
    expect(googleStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user profile', async () => {
      const mockReq = { query: { state: 'testState' } };
      const mockAccessToken = 'testAccessToken';
      const mockRefreshToken = 'testRefreshToken';
      const mockProfile = {
        id: 'testId',
        provider: 'google',
        name: { givenName: 'Test', familyName: 'User' },
        emails: [{ value: 'test@example.com' }],
      };
      const done: VerifyCallback = jest.fn();

      const result = await googleStrategy.validate(
        mockReq,
        mockAccessToken,
        mockRefreshToken,
        mockProfile,
        done,
      );

      const expectedUser: UserProfile = {
        providerUserId: 'testId',
        provider: 'google',
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
        await googleStrategy.validate(
          mockReq,
          mockAccessToken,
          mockRefreshToken,
          mockProfile,
          done,
        );
      } catch (e) {
        expect(console.error).toHaveBeenCalledWith({ googleStrategyError: e });
        expect(done).toHaveBeenCalledWith(e, false);
      }
    });
  });
});
