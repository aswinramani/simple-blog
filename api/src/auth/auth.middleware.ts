import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ErrorTypes } from '../shared/constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.error) {
        const state = req.query.state;
        return res.redirect(`${state}?error=${req.query.error}`);
      }
    } catch (e) {
      console.error("Unexpected Middleware Error ",{error: e});
      throw new UnauthorizedException(ErrorTypes.UNAUTHORIZED);
    }
    next();
  };
};
