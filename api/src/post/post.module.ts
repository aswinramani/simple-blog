import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DatabaseModule } from '../database/database.module';
import { postProviders } from './post.providers';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule
  ],
  providers: [
    ...postProviders,
    PostService
  ],
  controllers: [PostController]
})
export class PostModule {}
