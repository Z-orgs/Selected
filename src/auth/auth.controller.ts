import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // eslint-disable-next-line prettier/prettier
  }
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    return 'S';
  }
  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
