import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async login(@Req() req, @Res() res) {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.generateToken(user);    
    res.redirect(process.env.REDIRECT_URL + token);
  }

  @Get('login/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Req() req, @Res() res) {
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async callbackFacebook(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.generateToken(user);    
    res.redirect(process.env.REDIRECT_URL + token);
  }

}
