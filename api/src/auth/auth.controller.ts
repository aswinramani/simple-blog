import { Controller, Get, UseGuards, Req, Res, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { constants, AUTH_ROUTES } from '../shared/constants';
import { TokenData } from 'src/shared/interfaces/TokenData';

@Controller(AUTH_ROUTES.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(AUTH_ROUTES.GOOGLE_CALLBACK)
  @Public()
  @UseGuards(AuthGuard(constants.google))
  async callback(@Req() req, @Res() res) {
    const { accessToken, refreshToken }: TokenData = await this.authService.generateToken(req.user);
    res.redirect(`http://localhost:4201${constants.redirectPath}?token=${accessToken}&refresh=${refreshToken}`);
  }

  @Get(AUTH_ROUTES.FACEBOOK_CALLBACK)
  @Public()
  @UseGuards(AuthGuard(constants.facebook))
  async callbackFacebook(@Req() req, @Res() res) {
    const { accessToken, refreshToken }: TokenData = await this.authService.generateToken(req.user);
    res.redirect(`http://localhost:4201${constants.redirectPath}?token=${accessToken}&refresh=${refreshToken}`);
  }

  @Public()
  @Post(AUTH_ROUTES.REFRESH)
  async refresh(@Body() body, @Res() res) { 
    try {
      const { accessToken, refreshToken }: TokenData = await this.authService.refreshToken(body.refreshToken);
      res.json({ accessToken, refreshToken });
    } catch (e) {
      console.error({refreshErr: e});
      throw e;
    }
  }

}
