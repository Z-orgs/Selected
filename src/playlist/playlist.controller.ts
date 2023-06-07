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

@Controller('playlist')
@UseInterceptors(CacheInterceptor)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  deletePlaylist(@Req() req: Request, @Param('id') id: string) {
    return this.playlistService.deletePlaylist(req.user as User, id);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getPlaylistById(@Param('id') id: string) {
    return this.playlistService.getPlaylistById(id);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  getAllPlaylistAsUser(@Req() req: Request) {
    return this.playlistService.getAllPlaylistAsUser(req.user as User);
  }
}
