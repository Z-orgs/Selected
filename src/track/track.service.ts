import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose, { Connection } from 'mongoose';
import { async } from 'rxjs/internal/scheduler/async';
import { Socket } from 'socket.io';
import { FileService } from 'src/file/file.service';
import { MessagePlayDto } from './dto/message.play.dto';

@Injectable()
export class TrackService {
  private fileModel: MongoGridFS;
  //   private readonly bucket: GridFSBucket;
  constructor(
    private readonly fileService: FileService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
    // this.bucket = new mongoose.mongo.GridFSBucket(this.connection.db);
  }
  async getFile(id: string) {
    const file = await this.fileService.findInfo(id);
    const fileStream = await this.fileService.readStream(id);
    return { file, fileStream };
  }
}
