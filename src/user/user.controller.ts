import { Controller } from '@nestjs/common';
import { Get, Param, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from './model/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('follow/:artistId')
  @UseGuards(JwtAuthGuard)
  followArtist(@Req() req: Request, @Param('artistId') artistId: string) {
    return this.userService.followArtist(req.user as User, artistId);
  }
  @Put('unfollow/:artistId')
  @UseGuards(JwtAuthGuard)
  unFollowArtist(@Req() req: Request, @Param('artistId') artistId: string) {
    return this.userService.unfollowArtist(req.user as User, artistId);
  }
  @Put('like/:trackId')
  @UseGuards(JwtAuthGuard)
  likeTrack(@Req() req: Request, @Param('trackId') id: string) {
    return this.userService.likeTrack(req.user as User, id);
  }
  @Put('unlike/:trackId')
  @UseGuards(JwtAuthGuard)
  unlikeTrack(@Req() req: Request, @Param('trackId') id: string) {
    return this.userService.unlikeTrack(req.user as User, id);
  }
  @Get('likes')
  @UseGuards(JwtAuthGuard)
  getLikeList(@Req() req: Request) {
    return this.userService.getLikeList(req.user as User);
  }
}
