import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { TokenPayload } from '../shared/interfaces/TokenPayload';
import { DecodedToken } from '../shared/interfaces/DecodedToken';
import { constants } from '../shared/constants';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case constants.token:
                  return 'testAccessTokenSecret';
                case constants.tokenExpiry:
                  return '1h';
                case constants.refreshToken:
                  return 'testRefreshTokenSecret';
                case constants.refreshTokenExpiry:
                  return '7d';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const payload: TokenPayload = { sub: 1, email: 'test@example.com' };
      const accessToken = 'accessToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = service.generateAccessToken(payload);
      expect(result).toBe(accessToken);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: 'testAccessTokenSecret',
        expiresIn: '1h',
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const payload: TokenPayload = { sub: 1, email: 'test@example.com' };
      const refreshToken = 'refreshToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(refreshToken);

      const result = service.generateRefreshToken(payload);
      expect(result).toBe(refreshToken);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: 'testRefreshTokenSecret',
        expiresIn: '7d',
      });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify an access token', () => {
      const token = 'accessToken';
      const decodedToken: DecodedToken = { sub: 1, email: 'test@example.com', iat: 1616161616, exp: 1717171717 };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const result = service.verifyAccessToken(token);
      expect(result).toBe(decodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith(token, { secret: 'testAccessTokenSecret' });
    });

    it('should throw an error if access token is invalid', () => {
      const token = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyAccessToken(token)).toThrow('Invalid token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      const token = 'refreshToken';
      const decodedToken: DecodedToken = { sub: 1, email: 'test@example.com', iat: 1616161616, exp: 1717171717 };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const result = service.verifyRefreshToken(token);
      expect(result).toBe(decodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith(token, { secret: 'testRefreshTokenSecret' });
    });

    it('should throw an error if refresh token is invalid', () => {
      const token = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyRefreshToken(token)).toThrow('Invalid token');
    });
  });
});
