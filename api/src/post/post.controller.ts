import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { Public } from '../auth/public.decorator';
import { POST_ROUTES } from '../shared/constants';
import { PostCount } from '../shared/interfaces/PostCount';
import { PostIDResponse } from '../shared/interfaces/PostIDResponse';

@Controller(POST_ROUTES.BASE)
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}
  @Post()
  async create(@Req() req, @Body() body): Promise<PostEntity> {
    const userId:number = req.user.id;
    body.authorId = userId;
    return this.postService.create(body);
  }

  @Get()
  async getPosts(@Req() req, @Query('offset') offset: number = 0, @Query('limit') limit: number = 10): Promise<PostEntity[]> {
    const userId:number = req.user.id;
    const posts = await this.postService.getPosts(userId, offset, limit);
    return posts;
  }

  @Get(POST_ROUTES.COUNT)
  async getCount(@Req() req): Promise<PostCount> {
    const userId:number = req.user.id;
    const count = await this.postService.countByAuthorId(userId);
    return {"totalCount": count};
  }

  @Get(POST_ROUTES.ID)
  @Public()
  async findOne(@Param('id') id: string): Promise<PostIDResponse> {
    const post:PostEntity = await this.postService.findByPostId(id);
    return  {"data": post};
  }
}
