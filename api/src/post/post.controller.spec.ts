import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { constants } from '../shared/constants';
import { CreatePostDto } from './post.dto';
import { User } from '../user/user.entity';
import { Public } from '../auth/public.decorator';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn(),
            getPosts: jest.fn(),
            countByAuthorId: jest.fn(),
            findByPostId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const req = { user: { id: 1 } };
      const body = { title: 'Test Post', content: 'Test Content' };
      const post = { ...body, id: '1', authorId: 1 } as PostEntity;

      jest.spyOn(service, 'create').mockResolvedValue(post);

      const result = await controller.create(req, body);
      expect(result).toEqual(post);
      expect(service.create).toHaveBeenCalledWith(body);
    });
  });

  describe('getPosts', () => {
    it('should return posts for the user', async () => {
      const req = { user: { id: 1 } };
      const posts = [
        { id: '1', title: 'Test Post 1', content: 'Test Content 1', authorId: 1 } as PostEntity,
        { id: '2', title: 'Test Post 2', content: 'Test Content 2', authorId: 1 } as PostEntity,
      ];

      jest.spyOn(service, 'getPosts').mockResolvedValue(posts);

      const result = await controller.getPosts(req, 0, 10);
      expect(result).toEqual(posts);
      expect(service.getPosts).toHaveBeenCalledWith(1, 0, 10);
    });
  });

  describe('getCount', () => {
    it('should return the count of posts for the user', async () => {
      const req = { user: { id: 1 } };
      const count = 5;

      jest.spyOn(service, 'countByAuthorId').mockResolvedValue(count);

      const result = await controller.getCount(req);
      expect(result).toEqual({ totalCount: count });
      expect(service.countByAuthorId).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a post by ID', async () => {
      const post = { id: '1', title: 'Test Post', content: 'Test Content', authorId: 1 } as PostEntity;

      jest.spyOn(service, 'findByPostId').mockResolvedValue(post);

      const result = await controller.findOne('1');
      expect(result).toEqual({ data: post });
      expect(service.findByPostId).toHaveBeenCalledWith('1');
    });
  });
});
