import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserProfile } from '../shared/interfaces/UserProfile';
import { TokenPayload } from '../shared/interfaces/TokenPayload';
import { TokenData } from '../shared/interfaces/TokenData';
import { DecodedToken } from '../shared/interfaces/DecodedToken';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserDetails', () => {
    it('should create a new user if not exists', async () => {
      const userProfile: UserProfile = { email: 'test@example.com', provider: 'google', providerUserId: 'google123', profile: { givenName: 'John', familyName: 'Doe' } };
      const user: User = { id: 1, email: 'test@example.com', google_id: 'google123', facebook_id: null } as User;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(user);

      const result = await service.getUserDetails(userProfile);
      expect(result).toEqual(user);
      expect(userService.create).toHaveBeenCalledWith(userProfile);
    });

    it('should update existing user if provider ID is missing', async () => {
      const userProfile: UserProfile = { email: 'test@example.com', provider: 'google', providerUserId: 'google123', profile: { givenName: 'John', familyName: 'Doe' } };
      const user: User = { id: 1, email: 'test@example.com', google_id: null, facebook_id: null } as User;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'update').mockResolvedValue(undefined);

      const result = await service.getUserDetails(userProfile);
      expect(result).toEqual(user);
      expect(userService.update).toHaveBeenCalledWith(user.id, { google_id: 'google123' });
    });


    it('should update existing user if provider ID is missing for facebook', async () => {
        const userProfile: UserProfile = { email: 'test@example.com', provider: 'facebook', providerUserId: 'facebook123', profile: { givenName: 'John', familyName: 'Doe' } };
        const user: User = { id: 1, email: 'test@example.com', google_id: null, facebook_id: null } as User;
  
        jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
        jest.spyOn(userService, 'update').mockResolvedValue(undefined);
  
        const result = await service.getUserDetails(userProfile);
        expect(result).toEqual(user);
        expect(userService.update).toHaveBeenCalledWith(user.id, { facebook_id: 'facebook123' });
      });
  });

  describe('getTokens', () => {
    it('should return access and refresh tokens', () => {
      const payload: TokenPayload = { sub: 1, email: 'test@example.com' };
      const tokenData: TokenData = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      jest.spyOn(tokenService, 'generateAccessToken').mockReturnValue(tokenData.accessToken);
      jest.spyOn(tokenService, 'generateRefreshToken').mockReturnValue(tokenData.refreshToken);

      const result = service.getTokens(payload);
      expect(result).toEqual(tokenData);
      expect(tokenService.generateAccessToken).toHaveBeenCalledWith(payload);
      expect(tokenService.generateRefreshToken).toHaveBeenCalledWith(payload);
    });
  });

  describe('generateToken', () => {
    it('should generate tokens for a user profile', async () => {
      const userProfile: UserProfile = { email: 'test@example.com', provider: 'google', providerUserId: 'google123', profile: { givenName: 'John', familyName: 'Doe' } };
      const user: User = { id: 1, email: 'test@example.com', google_id: 'google123', facebook_id: null } as User;
      const payload: TokenPayload = { sub: user.id, email: user.email };
      const tokenData: TokenData = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      jest.spyOn(service, 'getUserDetails').mockResolvedValue(user);
      jest.spyOn(service, 'getTokens').mockReturnValue(tokenData);

      const result = await service.generateToken(userProfile);
      expect(result).toEqual(tokenData);
      expect(service.getUserDetails).toHaveBeenCalledWith(userProfile);
      expect(service.getTokens).toHaveBeenCalledWith(payload);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens if refresh token is valid', async () => {
      const refreshToken = 'validRefreshToken';
      const payload: DecodedToken = { sub: 1, email: 'test@example.com', iat: 1616161616, exp: 1717171717 };
      const user: User = { id: 1, email: 'test@example.com', google_id: 'google123', facebook_id: null } as User;
      const refreshPayload: TokenPayload = { sub: user.id, email: user.email };
      const tokenData: TokenData = { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' };

      jest.spyOn(tokenService, 'verifyRefreshToken').mockReturnValue(payload);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'getTokens').mockReturnValue(tokenData);

      const result = await service.refreshToken(refreshToken);
      expect(result).toEqual(tokenData);
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(userService.findByEmail).toHaveBeenCalledWith(payload.email);
      expect(service.getTokens).toHaveBeenCalledWith(refreshPayload);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalidRefreshToken';

      jest.spyOn(tokenService, 'verifyRefreshToken').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const refreshToken = 'validRefreshToken';
      const payload: DecodedToken = { sub: 1, email: 'test@example.com', iat: 1616161616, exp: 1717171717 };

      jest.spyOn(tokenService, 'verifyRefreshToken').mockReturnValue(payload);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });
});
