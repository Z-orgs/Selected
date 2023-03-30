import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { User } from 'src/user/model/user.model';
import { Request } from 'express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getHomePage(@Req() req: Request) {
    return this.homeService.getHomePage(req.user as User);
  }
}
