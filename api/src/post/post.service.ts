import { Inject, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './post.dto';
import { constants } from '../shared/constants';

@Injectable()
export class PostService {
  constructor(
    @Inject(constants.POST_REPOSITORY)
    private readonly postRepository: Repository<Post>
  ) {}

  async create(postDto: CreatePostDto): Promise<Post> {
    return this.postRepository.save(postDto);
  }

  async findByAuthorId(
    authorId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('posts')
      .where('posts.author_id = :authorId', { authorId })
      .orderBy('posts.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async countByAuthorId(authorId: number): Promise<number> {
    return this.postRepository
      .createQueryBuilder('posts')
      .where('posts.author_id = :authorId', { authorId })
      .getCount();
  }
  

  async findByPostId(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: {
        id
      },
      select: ['id', 'title', 'content'],
    });
  }

  async getPosts(
    authorId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<Post[]> {
    const posts = await this.findByAuthorId(authorId, offset, limit);
    return posts;
  }
}
