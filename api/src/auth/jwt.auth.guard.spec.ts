import { Reflector } from '@nestjs/core';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { DecodedToken } from '../shared/interfaces/DecodedToken';
import { User } from '../user/user.entity';
import { JwtAuthGuard } from './jwt.auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(() => {
    reflector = new Reflector();
    tokenService = {
      verifyAccessToken: jest.fn(),
    } as any;
    userService = {
      findByUserId: jest.fn(),
    } as any;

    jwtAuthGuard = new JwtAuthGuard(reflector, tokenService, userService);
  });

  describe('canActivate', () => {
    it('should allow access if route is public', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      } as any as ExecutionContext;

      jest.spyOn(reflector, 'get').mockReturnValue(true);

      const result = await jwtAuthGuard.canActivate(context);
      expect(result).toBe(true);
      expect(reflector.get).toHaveBeenCalledWith('isPublic', {});
    });

    it('should deny access if no token is provided', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      } as any as ExecutionContext;

      jest.spyOn(reflector, 'get').mockReturnValue(false);

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should deny access if token is invalid', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'Bearer invalidToken',
            },
          }),
        }),
      } as any as ExecutionContext;

      jest.spyOn(reflector, 'get').mockReturnValue(false);
      jest.spyOn(tokenService, 'verifyAccessToken').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should deny access if user is not found', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'Bearer validToken',
            },
          }),
        }),
      } as any as ExecutionContext;

      const decodedToken: DecodedToken = { sub: 1, email: 'test@example.com', iat: 1616161616, exp: 1717171717 };

      jest.spyOn(reflector, 'get').mockReturnValue(false);
      jest.spyOn(tokenService, 'verifyAccessToken').mockReturnValue(decodedToken);
      jest.spyOn(userService, 'findByUserId').mockResolvedValue(null);

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should allow access if token is valid and user is found', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'Bearer validToken',
            },
          }),
        }),
      } as any as ExecutionContext;

      const decodedToken: DecodedToken = { sub: 1, email: 'test@example.com', iat: 1616161616, exp: 1717171717 };
      const user: User = { id: 1, email: 'test@example.com' } as User;

      jest.spyOn(reflector, 'get').mockReturnValue(false);
      jest.spyOn(tokenService, 'verifyAccessToken').mockReturnValue(decodedToken);
      jest.spyOn(userService, 'findByUserId').mockResolvedValue(user);

      const result = await jwtAuthGuard.canActivate(context);
      expect(result).toBe(true);
      const request = context.switchToHttp().getRequest();
      expect(request.user).toEqual(user);
    });

    it('should handle token expired error', async () => {
      const context = {
        getHandler: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'Bearer expiredToken',
            },
          }),
        }),
      } as any as ExecutionContext;

      jest.spyOn(reflector, 'get').mockReturnValue(false);
      jest.spyOn(tokenService, 'verifyAccessToken').mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });
});
