import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { User } from 'src/user/model/user.model';
import { UpdateInfoTrackDto } from '../artist/dto/update-info-track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Get('all')
  @UseGuards(JwtAuthGuard)
  getHomeTrack(@Req() req: Request) {
    return this.trackService.getHomeTrack(req.user as User);
  }
}
