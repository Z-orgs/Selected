import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection, Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { User } from 'src/user/model/user.model';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { Track, TrackDocument } from './model/track.model';
import { Artist } from 'src/artist/model/artist.model';
import { MxzService } from 'src/mxz/mxz.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { mxzASPIRE } from 'src/mxz/mxz.aspire';
import { UpdateStatusTrack } from 'src/track/dto/update-status-track.dto';
import { Admin } from 'src/admin/model/admin.model';

@Injectable()
export class TrackService {
  private fileModel: MongoGridFS;
  constructor(
    private readonly fileService: FileService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly mxzService: MxzService,
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
  upload(user: Artist, responses: any[], createTrack: CreateTrackDto) {
    const track = new this.trackModel({
      filename: responses[0].filename,
      uploaded: new Date(),
      fileId: responses[0].id,
      status: 'pending',
      artist: user.username,
      release: createTrack.release,
      genre: createTrack.genre,
      title: createTrack.title,
      public: createTrack.public,
    } as Track);
    track.save();
    this.mxzService.createMxz({
      level: mxzASPIRE.Artist,
      username: user.username,
      log: `${user.username} has uploaded track ${track._id}`,
    });
    return track;
  }
  async updateInfoTrack(
    user: Artist,
    id: string,
    updateInfoTrack: UpdateInfoTrackDto,
  ) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.trackModel.findByIdAndUpdate({ _id: id }, updateInfoTrack);
      this.mxzService.createMxz({
        level: mxzASPIRE.Artist,
        username: user.username,
        log: `${user.username} has updated the information of track ${id}`,
      });
      return new HttpException(`Updated track ${id}`, HttpStatus.ACCEPTED);
    } catch (err) {
      return new HttpException(
        `Update failed track ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async updateStatusTrack(user: Admin, updateStatusTrack: UpdateStatusTrack) {
    const track = await this.trackModel.findById({
      _id: updateStatusTrack.trackId,
    });
    if (!track) {
      return new HttpException(
        `This track does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.trackModel.findByIdAndUpdate(
      { _id: updateStatusTrack.trackId },
      { status: updateStatusTrack.status },
    );
    this.mxzService.createMxz({
      level: mxzASPIRE.Admin,
      username: user.username,
      log: `${user.username} has updated the status of the track ${updateStatusTrack.trackId} from ${track.status} to ${updateStatusTrack.status}`,
    });
    return new HttpException('Status update successful', HttpStatus.ACCEPTED);
  }
}
