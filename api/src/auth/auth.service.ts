import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserProfile } from '../shared/interfaces/UserProfile';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { TokenService } from './token.service';
import { TokenPayload } from 'src/shared/interfaces/TokenPayload';
import { TokenData } from 'src/shared/interfaces/TokenData';
import { DecodedToken } from 'src/shared/interfaces/DecodedToken';

@Injectable()
export class AuthService {

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}


  async getUserDetails(userProfile: UserProfile): Promise<User> {
    let user:User = await this.userService.findByEmail(userProfile.email);
    if (!user) {
      user = await this.userService.create(userProfile)
    } else {
      let updateUserDto: UpdateUserDto = {};
      if (!user.google_id && userProfile.provider.toLowerCase() === 'google') {
        updateUserDto.google_id = userProfile.providerUserId;
      }
      if (!user.facebook_id && userProfile.provider.toLowerCase() === 'facebook') {
        updateUserDto.facebook_id = userProfile.providerUserId;
      }
      if (Object.keys(updateUserDto).length) {
        await this.userService.update(user.id, updateUserDto);
      }
    }
    return user;
  }

  getTokens(payload: TokenPayload): TokenData {
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async generateToken(userProfile: UserProfile): Promise<TokenData> {
    let user: User  = await this.getUserDetails(userProfile);
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    }
    return this.getTokens(payload);
  }

  async refreshToken(refreshToken: string): Promise<TokenData> {
    try {
      const payload:DecodedToken = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const refreshPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
      }
      return this.getTokens(refreshPayload);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
