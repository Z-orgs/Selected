import {
  Body,
  Controller,
  Delete,
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
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { TrackService } from './track.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileService } from 'src/file/file.service';
import { User } from 'src/user/model/user.model';
import { NextTrackDto } from './dto/next.track.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';

@Controller('track')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
  ) {}
  @Post('')
  @Roles(Role.Artist)
  @UseInterceptors(FilesInterceptor('file'))
  upload(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createTrack: CreateTrackDto,
  ) {
    return this.trackService.upload(
      req.user,
      this.fileService.upload(files),
      createTrack,
    );
  }
  @Put(':id')
  @Roles(Role.Artist)
  updateInfoTrack(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateInfoTrack: UpdateInfoTrackDto,
  ) {
    return this.trackService.updateInfoTrack(req.user, id, updateInfoTrack);
  }
  @Put('approved/:id')
  @Roles(Role.Admin, Role.Boss)
  updateStatusTrack(@Param('id') id: string, @Req() req: Request) {
    return this.trackService.updateStatusTrack(id, req.user);
  }
  @Get('info/:id')
  @Roles(Role.User)
  getTrackById(@Req() req: Request, @Param('id') id: string) {
    return this.trackService.getTrackById(req.user as User, id);
  }
  @Get('next')
  @Roles(Role.User)
  getNextTrack(@Req() req, @Body() nextMessage: NextTrackDto) {
    return this.trackService.nextTrack(req.user as User, nextMessage);
  }
  @Get('prev')
  @Roles(Role.User)
  getPrevTrack(@Req() req) {
    return this.trackService.prevTrack(req.user as User);
  }
  @Delete(':id')
  @Roles(Role.Artist)
  deleteTrack(@Req() req: Request, @Param('id') id: string) {
    return this.trackService.deleteTrack(req.user, id);
  }
}
