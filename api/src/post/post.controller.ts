import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { Public } from '../auth/public.decorator';

@Controller('posts')
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
  async getPosts(@Req() req, @Query('offset') offset: number = 0, @Query('limit') limit: number = 10) {
    const userId:number = req.user.id;
    const posts = await this.postService.getPosts(userId, offset, limit);
    return posts;
  }

  @Get('count')
  async getCount(@Req() req) {
    const userId:number = req.user.id;
    const count = await this.postService.countByAuthorId(userId);
    return {"totalCount": count};
  }

  @Get('/:id')
  @Public()
  async findOne(@Param('id') id: string): Promise<{"data": PostEntity}> {
    const post = await this.postService.findByPostId(id);
    return  {"data": post};
  }
}
