import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection, Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
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
  async updateInfoTrack(id: string, updateInfoTrack: UpdateInfoTrackDto) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.trackModel.findByIdAndUpdate({ _id: id }, updateInfoTrack);
      return new HttpException(`Updated track ${id}`, HttpStatus.ACCEPTED);
    } catch (err) {
      return new HttpException(
        `Update failed track ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
