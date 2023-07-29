import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './google/jwt-auth.guard';
import { SELECTED } from 'src/constants';
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
    try {
      if (!req.user) {
        return 'No user from google.';
      }
      const accessToken = this.jwtService.sign(req.user, {
        secret: SELECTED.Secret,
      });
      const refreshToken = this.jwtService.sign(req.user, {
        secret: SELECTED.RefreshSecret,
      });
      // res
      //   .cookie('accessToken', accessToken, { domain: SELECTED.DevIp })
      //   .cookie('refreshToken', refreshToken, { domain: SELECTED.DevIp })
      //   .redirect(`${SELECTED.DevIp}:3001`);
      return { accessToken, refreshToken };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
