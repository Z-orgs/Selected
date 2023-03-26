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
import { AlbumService } from './album.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Artist } from 'src/artist/model/artist.model';
import { JwtArtistAuthGuard } from 'src/auth/artist/jwtartist-auth.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-dto';
import { FileService } from 'src/file/file.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly fileService: FileService,
  ) {}
  @Post('')
  @UseGuards(JwtArtistAuthGuard)
  @UseInterceptors(FileInterceptor('covertAlbum'))
  createAlbum(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
    @Body() createAlbum: CreateAlbumDto,
  ) {
    return this.albumService.createAlbum(
      this.fileService.uploadImage(file),
      req.user as Artist,
      createAlbum,
    );
  }
  @Put(':id')
  @UseGuards(JwtArtistAuthGuard)
  @UseInterceptors(FileInterceptor('covertAlbum'))
  updateAlbum(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
    @Body() updateAlbum: UpdateAlbumDto,
  ) {
    return this.albumService.updateAlbum(
      id,
      this.fileService.uploadImage(file),
      req.user as Artist,
      updateAlbum,
    );
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumsById(id);
  }
}
