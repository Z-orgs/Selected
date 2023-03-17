import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection } from 'mongoose';
import { FileService } from 'src/file/file.service';

@Injectable()
export class TrackService {
  private fileModel: MongoGridFS;
  constructor(
    private readonly fileService: FileService,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }
  async getFile(id: string) {
    const file = await this.fileService.findInfo(id);
    const fileStream = await this.fileService.readStream(id);
    return { file, fileStream };
  }
}
