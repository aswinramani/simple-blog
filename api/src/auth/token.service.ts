import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../shared/interfaces/TokenPayload';
import { DecodedToken } from '../shared/interfaces/DecodedToken';
import { ConfigService } from '@nestjs/config';
import { constants } from '../shared/constants';

@Injectable()
export class TokenService {
  token = this.configService.get<string>(constants.token);
  tokenExpiry = this.configService.get<string>(constants.tokenExpiry);
  refreshToken = this.configService.get<string>(constants.refreshToken);
  refreshTokenExpiry = this.configService.get<string>(constants.refreshTokenExpiry);
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.token,
      expiresIn: this.tokenExpiry,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshToken,
      expiresIn: this.refreshTokenExpiry,
    });
  }

  verifyAccessToken(token: string): DecodedToken {
    try {
      const decoded = this.jwtService.verify(token, { secret: this.token });
      return decoded;
    } catch (error) {
      throw error;
    }
  }

  verifyRefreshToken(token: string): DecodedToken {
    try {
      const decoded = this.jwtService.verify(token, { secret: this.refreshToken });
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}
