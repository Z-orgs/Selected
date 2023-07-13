import {
  Body,
  Controller,
  Delete,
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
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-dto';
import { FileService } from 'src/file/file.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/google/jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('album')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly fileService: FileService,
  ) {}
  @Post()
  @Roles(Role.Artist)
  @UseInterceptors(FileInterceptor('image'))
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
      req.user,
      createAlbum,
    );
  }
  @Put(':id')
  @Roles(Role.Artist)
  @UseInterceptors(FileInterceptor('image'))
  updateAlbum(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateAlbum: UpdateAlbumDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const resultFile = file ? this.fileService.uploadImage(file) : null;
    return this.albumService.updateAlbum(id, resultFile, req.user, updateAlbum);
  }
  @Get(':id')
  @Roles(Role.User)
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumsById(id);
  }
  @Delete(':id')
  @Roles(Role.Artist)
  deleteAlbum(@Req() req: Request, @Param('id') id: string) {
    return this.albumService.deleteAlbum(req.user, id);
  }
}
