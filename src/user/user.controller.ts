import { Controller } from '@nestjs/common';
import { Get, Param, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from './model/user.model';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('follow/:artistId')
  followArtist(@Req() req: Request, @Param('artistId') artistId: string) {
    return this.userService.followArtist(req.user as User, artistId);
  }
  @Put('unfollow/:artistId')
  unFollowArtist(@Req() req: Request, @Param('artistId') artistId: string) {
    return this.userService.unfollowArtist(req.user as User, artistId);
  }
  @Put('like/:trackId')
  likeTrack(@Req() req: Request, @Param('trackId') id: string) {
    return this.userService.likeTrack(req.user as User, id);
  }
  @Put('unlike/:trackId')
  unlikeTrack(@Req() req: Request, @Param('trackId') id: string) {
    return this.userService.unlikeTrack(req.user as User, id);
  }
  @Get('likes')
  getLikeList(@Req() req: Request) {
    return this.userService.getLikeList(req.user as User);
  }
  @Get()
  getProfile(@Req() req: Request) {
    return this.userService.getCurrentUser(req.user as User);
  }
}
