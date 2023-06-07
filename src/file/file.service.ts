import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class FileService {
  upload(files: Express.Multer.File[]) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
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

      response.push(fileResponse);
    });
    return response;
  }

  uploadImage(file: Express.Multer.File) {
    return file.filename;
  }

  getFile(id: string, res: Response<any, Record<string, any>>) {
    const filePath = `./data/filesElected/${id}`;
    try {
      if (!existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('File not found');
        return;
      }
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send('Internal Server Error');
    }
  }
}
