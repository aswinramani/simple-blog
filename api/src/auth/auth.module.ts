import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { HttpModule } from '@nestjs/axios';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { TokenService } from './token.service';
import { CustomConfigModule } from '../config/custom.config.module';
import { ConfigService } from '@nestjs/config';
import { constants, AUTH_ROUTES } from '../shared/constants';
@Module({
  imports: [
    CustomConfigModule,
    PassportModule.register({ session: false }),
    HttpModule,
    JwtModule.register({}),
    UserModule
  ],
  providers: [
    TokenService,
    AuthService,
    GoogleStrategy,
    {
      provide: constants.GOOGLE_CONFIG,
      useFactory: (configService: ConfigService) => {
        return {
          clientID: configService.get<string>(constants.googleClientId),
          clientSecret: configService.get<string>(constants.googleClientSecret),
          callbackURL: configService.get<string>(constants.host) + configService.get<string>(constants.googleCallBackPath),
          scope: configService.get<string[]>(constants.googleScopes),
          passReqToCallback: true
        };
      },
      inject: [ConfigService],
    },
    FacebookStrategy,
    {
      provide: constants.FACEBOOK_CONFIG,
      useFactory: (configService: ConfigService) => {
        return {
          clientID: configService.get<string>(constants.facebookAppId), 
          clientSecret: configService.get<string>(constants.facebookAppSecret),
          callbackURL: configService.get<string>(constants.host) + configService.get<string>(constants.facebookCallBackPath),
          profileFields: configService.get<string[]>(constants.facebookScopes),
          passReqToCallback: true
        };
      },
      inject: [ConfigService],
    },
    ],
  controllers: [AuthController],
  exports: [JwtModule, TokenService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(`/${AUTH_ROUTES.BASE}/${AUTH_ROUTES.FACEBOOK_CALLBACK}`, `/${AUTH_ROUTES.BASE}/${AUTH_ROUTES.GOOGLE_CALLBACK}`);
  }
}
