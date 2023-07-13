import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { OAuth2Client } from 'google-auth-library';
import { SELECTED } from 'src/constants';
import { JwtAuthGuard } from './google/jwt-auth.guard';

const client = new OAuth2Client(SELECTED.ClientId, SELECTED.ClientSecret);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    return '710';
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(req, res);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Param('all') all = false) {
    return this.authService.logout(req.user, all);
  }
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
