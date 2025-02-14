import { AuthMiddleware } from './auth.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { mockValues } from '../shared/constants';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const state: string = mockValues.state;
  beforeEach(() => {
    middleware = new AuthMiddleware();
    req = {};
    res = {
      redirect: jest.fn(),
    };
    next = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should redirect if query error is present', () => {
    req.query = { error: 'some_error', state };

    middleware.use(req as Request, res as Response, next);

    expect(res.redirect).toHaveBeenCalledWith(`${state}?error=some_error`);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if no query error is present', () => {
    req.query = {};

    middleware.use(req as Request, res as Response, next);

    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle unexpected errors and throw UnauthorizedException', () => {
    const error = new Error('Unexpected Error');
    jest.spyOn(res, 'redirect').mockImplementation(() => {
      throw error;
    });

    req.query = { error: 'some_error', state };

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(UnauthorizedException);
    expect(next).not.toHaveBeenCalled();
  });
});
