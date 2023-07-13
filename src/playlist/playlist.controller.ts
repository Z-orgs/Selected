import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { Request } from 'express';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { User } from 'src/user/model/user.model';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('playlist')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @Roles(Role.User)
  createPlaylist(
    @Req() req: Request,
    @Body() createPlaylist: CreatePlaylistDto,
  ) {
    return this.playlistService.createPlaylist(
      req.user as User,
      createPlaylist,
    );
  }

  @Put('add/:id')
  @Roles(Role.User)
  addTrackToPlaylist(
    @Req() req: Request,
    @Body('trackId') trackId: string,
    @Param('id') id: string,
  ) {
    return this.playlistService.addTrackToPlaylist(
      req.user as User,
      trackId,
      id,
    );
  }

  @Put('delete/:id')
  @Roles(Role.User)
  deleteTrackFromPlaylist(
    @Req() req: Request,
    @Body() trackId: string,
    @Param('id') id: string,
  ) {
    return this.playlistService.deleteTrackFromPlaylist(
      req.user as User,
      trackId,
      id,
    );
  }

  @Delete(':id')
  @Roles(Role.User)
  deletePlaylist(@Req() req: Request, @Param('id') id: string) {
    return this.playlistService.deletePlaylist(req.user as User, id);
  }
  @Get(':id')
  @Roles(Role.User)
  getPlaylistById(@Param('id') id: string) {
    return this.playlistService.getPlaylistById(id);
  }
  @Get()
  @Roles(Role.User)
  getAllPlaylistAsUser(@Req() req: Request) {
    return this.playlistService.getAllPlaylistAsUser(req.user as User);
  }
}
