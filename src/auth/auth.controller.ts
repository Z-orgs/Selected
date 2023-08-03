import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './google/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
    return this.authService.googleRedirect(req, res);
  }

  @Post('login')
  login(@Body('code') code: string) {
    return this.authService.login(code);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Body('refreshToken') refreshToken: string) {
    return this.authService.logout(req.user, refreshToken);
  }
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
