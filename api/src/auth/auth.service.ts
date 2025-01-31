import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
