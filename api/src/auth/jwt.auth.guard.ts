import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { DecodedToken } from '../shared/interfaces/DecodedToken';
import { User } from '../user/user.entity';
import { ErrorTypes } from '../shared/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const isPublic = this.reflector.get<boolean>('isPublic', handler);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authTokenList = request.headers.authorization?.split(' ');
    const token = authTokenList[authTokenList.length-1];
    if (!token) {
      throw new UnauthorizedException(ErrorTypes.UNAUTHORIZED);
    }
    try {
      const decoded:DecodedToken = this.tokenService.verifyAccessToken(token);
      const user:User = await this.userService.findByUserId(decoded.sub);
      if (!user) {
        throw new UnauthorizedException(ErrorTypes.UNAUTHORIZED);
      }
      request.user = user;
      return true;
    } catch (err) {
      console.error("Unexpected Auth Error ",{error: err});
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ErrorTypes.TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(ErrorTypes.UNAUTHORIZED);
    }
  }
}
