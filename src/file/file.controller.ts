import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
  @Post('')
  @UseInterceptors(FilesInterceptor('file'))
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileService.upload(files);
  }
  // @Get('info/:id')
  // getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
  //   return this.fileService.getFileInfo(id);
  // }
  @Get(':id')
  getFile(@Param('id') id: string, @Res() res: Response) {
    return this.fileService.getFile(id, res);
  }
  // @Get('download/:id')
  // downloadFile(@Param('id') id: string, @Res() res: Response) {
  //   return this.fileService.downloadFile(id, res);
  // }
  // @Get('delete/:id')
  // deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
  //   return this.fileService.deleteFile(id);
  // }
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadImage(file);
  }
}
