import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileInfoVm } from './file-info-vm.model';
import { FileResponseVm } from './file-response.modal';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class FileService {
  fileModel: any;
  // async readStream(id: string) {
  //   return await this.fileModel.readFileStream(id);
  // }
  readStream(path: string): fs.ReadStream {
    return fs.createReadStream(path);
  }

  async findInfo(id: string) {
    const result = await this.fileModel
      .findById(id)
      .catch((err) => {
        console.log(err);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      })
      .then((result) => result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
    };
  }

  async deleteFile(id: string): Promise<FileResponseVm> {
    const file = await this.findInfo(id);
    const filestream = await this.fileModel.delete(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }
  async getFileInfo(id: string): Promise<FileResponseVm> {
    const file = await this.findInfo(id);
    const filestream = await this.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }
  upload(files: Express.Multer.File[]) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      console.log(fileReponse);

      response.push(fileReponse);
    });
    return response;
  }
  async getFile(id: string, res: Response) {
    const file = await this.findInfo(id);
    const filestream = await this.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }
  async downloadFile(id: string, res: Response) {
    const file = await this.findInfo(id);
    const filestream = await this.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }
  uploadImage(file: Express.Multer.File) {
    return file.id;
  }
}
