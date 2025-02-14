import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { constants } from '../shared/constants';
import { CreatePostDto } from './post.dto';
import { User } from '../user/user.entity';

describe('PostService', () => {
  let service: PostService;
  let repository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: constants.POST_REPOSITORY,
          useExisting: getRepositoryToken(Post),
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save a new post', async () => {
      const postDto: CreatePostDto = { title: 'Test Post', content: 'Test Content', authorId: 1 };
      const savedPost = { ...postDto, id: '1', createdAt: new Date(), updatedAt: new Date() };

      jest.spyOn(repository, 'save').mockResolvedValue(savedPost as Post);

      const result = await service.create(postDto);
      expect(result).toEqual(savedPost);
      expect(repository.save).toHaveBeenCalledWith(postDto);
    });
  });

  describe('findByAuthorId', () => {
    it('should return posts by author ID', async () => {
      const authorId = 1;
      const posts = [
        { id: '1', title: 'Test Post 1', content: 'Test Content 1', authorId, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Test Post 2', content: 'Test Content 2', authorId, createdAt: new Date(), updatedAt: new Date() },
      ];

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(posts),
      } as any);

      const result = await service.findByAuthorId(authorId);
      expect(result).toEqual(posts);
    });
  });

  describe('countByAuthorId', () => {
    it('should return the count of posts by author ID', async () => {
      const authorId = 1;
      const count = 5;

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(count),
      } as any);

      const result = await service.countByAuthorId(authorId);
      expect(result).toBe(count);
    });
  });

  describe('findByPostId', () => {
    it('should return a post by ID', async () => {
      const id = '1';
      const post = { id, title: 'Test Post', content: 'Test Content', authorId: 1, createdAt: new Date(), updatedAt: new Date() };

      jest.spyOn(repository, 'findOne').mockResolvedValue(post as Post);

      const result = await service.findByPostId(id);
      expect(result).toEqual(post);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        select: ['id', 'title', 'content'],
      });
    });
  });

  describe('getPosts', () => {
    it('should return posts by author ID', async () => {
      const authorId = 1;
      const posts:Post[] = [
        { id: '1', title: 'Test Post 1', content: 'Test Content 1', authorId, createdAt: new Date(), updatedAt: new Date(), author: new User() },
        { id: '2', title: 'Test Post 2', content: 'Test Content 2', authorId, createdAt: new Date(), updatedAt: new Date(), author: new User() },
      ];

      jest.spyOn(service, 'findByAuthorId').mockResolvedValue(posts);

      const result = await service.getPosts(authorId);
      expect(result).toEqual(posts);
    });
  });
});
