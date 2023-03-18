import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Admin } from 'src/admin/model/admin.model';
import { Artist } from 'src/artist/model/artist.model';
import { AdminAuthGuard } from './admin/admin-auth.guard';
import { ArtistAuthGuard } from './artist/artist-auth.guard';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    return 'A$PIRE mxz';
  }
  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
  @Post('admin/login')
  @UseGuards(AdminAuthGuard)
  adminLogin(@Req() req: Request) {
    return this.authService.adminLogin(req.user as Admin);
  }
  @Post('artist/login')
  @UseGuards(ArtistAuthGuard)
  artistLogin(@Req() req: Request) {
    return this.authService.artistLogin(req.user as Artist);
  }
}
