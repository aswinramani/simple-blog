import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { constants } from '../shared/constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.query.error) {
      return res.redirect(`http://localhost:4201${constants.redirectPath}?error=${req.query.error}`);
    }
    next();
  };
};
