import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  Body,
  Param,
  Put,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { FileService } from 'src/file/file.service';
import { UpdateInfoTrackDto } from 'src/artist/dto/update-info-track.dto';
import { TrackService } from 'src/track/track.service';
import { ArtistService } from './artist.service';
import { Artist } from './model/artist.model';
import { Request } from 'express';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly fileService: FileService,
    private readonly trackService: TrackService,
  ) {}
  @Post('')
  @UseGuards(JwtArtistAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  upload(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createTrack: CreateTrackDto,
  ) {
    return this.artistService.upload(
      req.user as Artist,
      this.fileService.upload(files),
      createTrack,
    );
  }
  @Put('track/:id')
  @UseGuards(JwtArtistAuthGuard)
  updateInfoTrack(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateInfoTrack: UpdateInfoTrackDto,
  ) {
    return this.artistService.updateInfoTrack(
      req.user as Artist,
      id,
      updateInfoTrack,
    );
  }
}
