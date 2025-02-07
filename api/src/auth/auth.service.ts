import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserProfile } from '../shared/utils/interfaces';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { TokenService } from './token.service';

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

  getTokens(payload) {
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async generateToken(userProfile: UserProfile) {
    let user: User  = await this.getUserDetails(userProfile);
    return this.getTokens({
      sub: user.id,
      email: user.email,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload:any = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return this.getTokens({
        sub: user.id,
        email: user.email,
      });
    } catch (err) {
      console.error({refreshTokenErr: err});
      throw new UnauthorizedException('Invalid token');
    }
  }
}
