import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Body, Param, Put, Req, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { FileService } from 'src/file/file.service';
import { UpdateInfoTrackDto } from 'src/track/dto/update-info-track.dto';
import { ArtistService } from './artist.service';
import { Artist } from './model/artist.model';
import { Request } from 'express';
import { CreateTrackDto } from '../track/dto/create-track.dto';

@Controller('artist')
export class ArtistController {}
