import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { User } from 'src/user/model/user.model';
import { Request } from 'express';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';

@Controller('home')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  @Roles(Role.User)
  getHomePage(@Req() req: Request) {
    return this.homeService.getHomePage(req.user as User);
  }
}
