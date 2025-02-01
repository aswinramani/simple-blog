import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '../shared/utils/interfaces';
import { UtilsService } from '../shared/utils/utils.service';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly utilsService: UtilsService,
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

  async generateToken(userProfile: UserProfile) {
    let user: User  = await this.getUserDetails(userProfile);
    const profileName =  this.utilsService.capitalizeProfileName(userProfile.profile);
    const payload = {
      sub: user.id,
      name: profileName,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
