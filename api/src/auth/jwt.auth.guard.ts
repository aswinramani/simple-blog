import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
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
    const token = authTokenList[authTokenList.length-1]
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findByUserId(decoded.sub); // Call UserService to get user details
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      request.user = user;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
