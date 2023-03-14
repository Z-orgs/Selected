import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucket, GridFSBucketReadStream } from 'mongodb';
import { FileInfoVm } from './file-info-vm.model';
import { FileResponseVm } from './file-response.modal';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { Response } from 'express';

@Injectable()
export class FileService {
  private fileModel: MongoGridFS;
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

  getBucket(): GridFSBucket {
    return this.fileModel.bucket;
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<FileInfoVm> {
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
      response.push(fileReponse);
      new this.trackModel({ fileId: fileReponse.id }).save();
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
}
