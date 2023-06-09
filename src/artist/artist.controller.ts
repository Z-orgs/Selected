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
import { CreateArtistDto } from './dto/create-artist.dto';
import { ArtistService } from './artist.service';
import { Admin } from 'src/admin/model/admin.model';
import { JwtAdminAuthGuard } from 'src/auth/admin/jwtadmin-auth.guard';
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './model/artist.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { ChangePasswordDto } from 'src/admin/dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { User } from 'src/user/model/user.model';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('artist')
@UseInterceptors(CacheInterceptor)
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly fileService: FileService,
  ) {}
  @Post()
  @UseGuards(JwtAdminAuthGuard)
  createArtist(@Req() req: Request, @Body() createArtist: CreateArtistDto) {
    return this.artistService.createArtist(req.user as Admin, createArtist);
  }
  @Put()
  @UseGuards(JwtArtistAuthGuard)
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
    return this.artistService.updateArtist(
      req.user as Artist,
      updateArtist,
      resultFile,
    );
  }
  @Put('password')
  @UseGuards(JwtArtistAuthGuard)
  changePassword(
    @Req() req: Request,
    @Body() changePassword: ChangePasswordDto,
  ) {
    return this.artistService.changePassword(
      req.user as Artist,
      changePassword,
    );
  }
  @Put('reset/:id')
  @UseGuards(JwtAdminAuthGuard)
  resetPassword(@Req() req: Request, @Param('id') id: string) {
    return this.artistService.resetPassword(req.user as Admin, id);
  }
  @Get('artist/:id')
  @UseGuards(JwtAuthGuard)
  getArtistById(@Req() req: Request, @Param('id') id: string) {
    return this.artistService.getArtistById(req.user as User, id);
  }

  @Get('album')
  @UseGuards(JwtArtistAuthGuard)
  getAllAlbums(@Req() req: Request) {
    return this.artistService.getAllAlbums(req.user as Artist);
  }

  @Get('album/:id')
  @UseGuards(JwtArtistAuthGuard)
  getAlbumById(@Param('id') id: string) {
    return this.artistService.getAlbumById(id);
  }

  @Get('track')
  @UseGuards(JwtAdminAuthGuard)
  getAllTracks(@Req() req: Request) {
    return this.artistService.getAllTracks(req.user as Artist);
  }

  @Get('track/:id')
  @UseGuards(JwtAdminAuthGuard)
  getTrackById(@Param('id') id: string) {
    return this.artistService.getTrackById(id);
  }
}
