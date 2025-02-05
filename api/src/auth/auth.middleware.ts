import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.query.error) {
      return res.redirect('http://localhost:4201/auth/redirect?error='+req.query.error);
    }
    next();
  };
};
