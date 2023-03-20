import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection, Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { User } from 'src/user/model/user.model';
import { UpdateInfoTrackDto } from '../artist/dto/update-info-track.dto';
import { Track, TrackDocument } from './model/track.model';

@Injectable()
export class TrackService {
  private fileModel: MongoGridFS;
  constructor(
    private readonly fileService: FileService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
  ) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }
  async getFile(id: string) {
    const file = await this.fileService.findInfo(id);
    const fileStream = await this.fileService.readStream(id);
    return { file, fileStream };
  }
  getHomeTrack(user: User) {
    return [];
  }
}
