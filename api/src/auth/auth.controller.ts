import { Controller, Get, UseGuards, Req, Res, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.generateToken(req.user);
    res.redirect(`http://localhost:4201/auth/redirect?token=${accessToken}&refresh=${refreshToken}`);
  }

  @Get('facebook/callback')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async callbackFacebook(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.generateToken(req.user);
    res.redirect(`http://localhost:4201/auth/redirect?token=${accessToken}&refresh=${refreshToken}`);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body, @Res() res) {
    try {
      const { accessToken, refreshToken } = await this.authService.refreshToken(body.refreshToken);
      res.json({ accessToken, refreshToken });
    } catch (e) {
      console.error({refreshErr: e});
      throw e;
    }
  }

}
