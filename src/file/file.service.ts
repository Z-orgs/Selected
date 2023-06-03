import { Injectable } from '@nestjs/common';
import { File, FileDocument } from './model/file.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Injectable()
export class FileService {
  findInfo(id: string) {
    throw new Error('Method not implemented.');
  }
  readStream(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {}

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

      response.push(fileReponse);
    });
    return response;
  }

  uploadImage(file: Express.Multer.File) {
    return file.filename;
  }

  getFile(id: string, res: Response<any, Record<string, any>>) {
    // res.setHeader('Content-Type', 'image/jpeg');
    const fileStream = createReadStream(`./data/filesElected/${id}`);
    fileStream.pipe(res);
  }
}
