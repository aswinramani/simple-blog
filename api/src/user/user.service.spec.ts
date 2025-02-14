import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { constants } from '../shared/constants';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserProfile } from '../shared/interfaces/UserProfile';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: constants.USER_REPOSITORY,
          useExisting: getRepositoryToken(User),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, email: 'test@example.com', google_id: 'google123', facebook_id: null } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findByUserId(1);
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'email', 'google_id', 'facebook_id'],
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com', google_id: 'google123', facebook_id: null } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: ['id', 'email', 'google_id', 'facebook_id'],
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userProfile: UserProfile = {
        email: 'test@example.com',
        profile: { givenName: 'John', familyName: 'Doe' },
        provider: 'google',
        providerUserId: 'google123',
      };

      const createUserDto: CreateUserDto = {
        email: userProfile.email,
        givenName: userProfile.profile.givenName,
        familyName: userProfile.profile.familyName,
        google_id: userProfile.provider.toLowerCase() === 'google' ? userProfile.providerUserId : null,
        facebook_id: userProfile.provider.toLowerCase() === 'facebook' ? userProfile.providerUserId : null,
      };

      const user = { ...createUserDto, id: 1 } as User;

      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(userProfile);
      expect(result).toEqual(user);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { givenName: 'Jane', familyName: 'Doe' };

      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      await service.update(1, updateUserDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });
});
