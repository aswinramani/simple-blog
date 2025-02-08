import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserProfile } from '../shared/interfaces/UserProfile';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { constants } from '../shared/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(constants.USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUserId(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id
      },
      select: ['id', 'email', 'google_id', 'facebook_id'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email
      },
      select: ['id', 'email', 'google_id', 'facebook_id'],
    });
  }

  async create(userProfile: UserProfile): Promise<User> {
    const createUserDto: CreateUserDto = {
      email: userProfile["email"],
      givenName: userProfile["profile"]["givenName"],
      familyName: userProfile["profile"]["familyName"],
      google_id: userProfile["provider"].toLowerCase() === 'google' ? userProfile["providerUserId"] : null,
      facebook_id: userProfile["provider"].toLowerCase() === 'facebook' ? userProfile["providerUserId"] : null,
    }
    return this.userRepository.save(createUserDto);
  }

  async update(id, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, updateUserDto);
  }

}