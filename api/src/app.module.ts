import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { CustomConfigModule } from './config/custom.config.module';
import { MemoryProfilingService } from './memory-profiling/memory-profiling.service';
import { MemoryProfilingController } from './memory-profiling/memory-profiling.controller';

@Module({
  imports: [
    CustomConfigModule,
    AuthModule,
    UserModule,
    DatabaseModule,
    PostModule,
  ],
  controllers: [MemoryProfilingController],
  providers: [
    MemoryProfilingService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
