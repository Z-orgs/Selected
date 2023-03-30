import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { User } from 'src/user/model/user.model';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { TrackService } from './track.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Artist } from 'src/artist/model/artist.model';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileService } from 'src/file/file.service';
import { JwtAdminAuthGuard } from 'src/auth/admin/jwtadmin-auth.guard';
import { Admin } from 'src/admin/model/admin.model';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
  ) {}
  @Post('')
  @UseGuards(JwtArtistAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  upload(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createTrack: CreateTrackDto,
  ) {
    return this.trackService.upload(
      req.user as Artist,
      this.fileService.upload(files),
      createTrack,
    );
  }
  @Put(':id')
  @UseGuards(JwtArtistAuthGuard)
  updateInfoTrack(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateInfoTrack: UpdateInfoTrackDto,
  ) {
    return this.trackService.updateInfoTrack(
      req.user as Artist,
      id,
      updateInfoTrack,
    );
  }
  @Put('approved/:id')
  @UseGuards(JwtAdminAuthGuard)
  updateStatusTrack(@Param('id') id: string, @Req() req: Request) {
    return this.trackService.updateStatusTrack(id, req.user as Admin);
  }
  @Get('info/:id')
  @UseGuards(JwtAuthGuard)
  getTrackById(@Param('id') id: string) {
    return this.trackService.getTrackById(id);
  }
}
