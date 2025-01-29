import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { HttpModule } from '@nestjs/axios';
import { FacebookStrategy } from './strategies/facebook.strategy';
@Module({
  imports: [    
    PassportModule.register({ session: false}),
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

