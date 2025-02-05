import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { HttpModule } from '@nestjs/axios';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from './auth.middleware';
@Module({
  imports: [    
    PassportModule.register({ session: false}),
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    SharedModule,
    UserModule
  ],
  providers: [AuthService, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/auth/facebook/callback', '/auth/google/callback');
  }
}

