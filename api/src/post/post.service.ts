import { Inject, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(postDto: CreatePostDto): Promise<Post> {
    return this.postRepository.save(postDto);
  }

  // async findByAuthorId(
  //   authorId: number,
  //   offset: number = 0,
  //   limit: number = 10,
  // ): Promise<Post[]> {
  //   return this.postRepository
  //     .createQueryBuilder('posts')
  //     .where('posts.author_id = :author_id', { authorId })
  //     .orderBy('posts.createdAt', 'DESC')
  //     .skip(offset)
  //     .take(limit)
  //     .getMany();
  // }

  async findByAuthorId(
    authorId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('posts')
      .where('posts.author_id = :authorId', { authorId }) // Ensure author_id matches your column name
      .orderBy('posts.createdAt', 'DESC')
      .offset(offset) // Use offset instead of skip for PostgreSQL compatibility
      .limit(limit) // Use limit instead of take for PostgreSQL compatibility
      .getMany();
  }
  

  async findByPostId(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: {
        id
      },
      select: ['id', 'title', 'content'],
    });
  }

  async countByAuthorId(authorId: number): Promise<number> {
    return this.postRepository
      .createQueryBuilder('posts')
      .where('posts.author_id = :authorId', { authorId })
      .getCount();
  }

  async getPaginatedPosts(
    authorId: number,
    offset: number = 0,
    limit: number = 10,
  ): Promise<{ posts: Post[]; hasNextPage: boolean }> {
    const [posts, count] = await Promise.all([
      this.findByAuthorId(authorId, offset, limit),
      this.countByAuthorId(authorId),
    ]);

    const hasNextPage = count > offset + limit;
    return { posts, hasNextPage };
  }
}
