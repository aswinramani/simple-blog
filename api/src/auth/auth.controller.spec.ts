import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ErrorTypes, mockValues } from '../shared/constants';
import { TokenData } from '../shared/interfaces/TokenData';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let app: INestApplication;
  const state: string = mockValues.state;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
        ConfigService
      ],
    }).compile();

    app = module.createNestApplication();
    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('callback', () => {
    it('should redirect with tokens for Google', async () => {
      const req = { user: { user: { id: 1 }, state } };
      const res = { redirect: jest.fn() };
      const tokenData: TokenData = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      jest.spyOn(service, 'generateToken').mockResolvedValue(tokenData);

      await controller.callback(req, res);
      expect(res.redirect).toHaveBeenCalledWith(`${state}?token=accessToken&refresh=refreshToken`);
    });

    it('should redirect with tokens for Facebook', async () => {
      const req = { user: { user: { id: 1 }, state } };
      const res = { redirect: jest.fn() };
      const tokenData: TokenData = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      jest.spyOn(service, 'generateToken').mockResolvedValue(tokenData);

      await controller.callbackFacebook(req, res);
      expect(res.redirect).toHaveBeenCalledWith(`${state}?token=accessToken&refresh=refreshToken`);
    });
  });

  describe('refresh', () => {
    it('should return new tokens', async () => {
      const body = { refreshToken: 'oldRefreshToken' };
      const res = { json: jest.fn() };
      const tokenData: TokenData = { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' };

      jest.spyOn(service, 'refreshToken').mockResolvedValue(tokenData);

      await controller.refresh(body, res);
      expect(res.json).toHaveBeenCalledWith(tokenData);
    });

    it('should return an error if refresh fails', async () => {
      const body = { refreshToken: 'invalidToken' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(service, 'refreshToken').mockRejectedValue(new Error(ErrorTypes.INVALID_TOKEN));

      await controller.refresh(body, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: ErrorTypes.INVALID_TOKEN });
    });
  });
});
