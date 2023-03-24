import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { Request } from 'express';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { User } from 'src/user/model/user.model';

@Controller('playlist')
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  addTrackToPlaylist(
    @Req() req: Request,
    @Body() trackId: string,
    @Param('id') id: string,
  ) {
    return this.playlistService.addTrackToPlaylist(
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
}
