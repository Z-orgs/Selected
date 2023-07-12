import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Admin } from 'src/admin/model/admin.model';
import { Artist } from 'src/artist/model/artist.model';
import { AdminAuthGuard } from './admin/admin-auth.guard';
import { ArtistAuthGuard } from './artist/artist-auth.guard';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { OAuth2Client } from 'google-auth-library';
import { SELECTED } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/model/user.model';

const client = new OAuth2Client(SELECTED.ClientId, SELECTED.ClientSecret);

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
    return this.authService.googleLogin(req, res);
  }

  // @Post('/login')
  // async login(@Body('token') token): Promise<any> {
  //   const ticket = await client.verifyIdToken({
  //     idToken: token,
  //     audience: SELECTED.ClientId,
  //   });
  //   // console.log(ticket.getPayload(), 'ticket');
  //   const { email, name, picture, given_name, family_name } =
  //     ticket.getPayload();
  //   const data = await this.authService.login({
  //     email,
  //     name,
  //     picture,
  //     given_name,
  //     family_name,
  //   });
  //   return {
  //     data,
  //     jwt: this.jwtService.sign({
  //       email,
  //       firstName: given_name,
  //       lastName: family_name,
  //       picture: picture,
  //     }),
  //     message: 'success',
  //   };
  // }

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
