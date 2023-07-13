import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ArtistService } from './artist.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { UpdateArtistDto } from './update.artist.dto';

@Controller('artist')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly fileService: FileService,
  ) {}
  @Post()
  @Roles(Role.Boss, Role.Admin)
  makeArtist(@Req() req: Request, @Body('email') email: string) {
    return this.artistService.makeArtist(req, email);
  }
  @Put()
  @Roles(Role.Artist)
  @UseInterceptors(FileInterceptor('image'))
  updateArtist(
    @Req() req: Request,
    @Body() updateArtist: UpdateArtistDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const resultFile = file ? this.fileService.uploadImage(file) : null;
    return this.artistService.updateArtist(req.user, updateArtist, resultFile);
  }

  @Get('artist/:id')
  @Roles(Role.User)
  getArtistById(@Req() req: Request, @Param('id') id: string) {
    return this.artistService.getArtistById(req.user, id);
  }

  @Get('album')
  @Roles(Role.Artist)
  getAllAlbums(@Req() req: Request) {
    return this.artistService.getAllAlbums(req.user);
  }

  @Get('album/:id')
  @Roles(Role.Artist)
  getAlbumById(@Param('id') id: string) {
    return this.artistService.getAlbumById(id);
  }

  @Get('track')
  @Roles(Role.Artist)
  getAllTracks(@Req() req: Request) {
    return this.artistService.getAllTracks(req.user);
  }

  @Get('track/:id')
  @Roles(Role.Artist)
  getTrackById(@Param('id') id: string) {
    return this.artistService.getTrackById(id);
  }
}
