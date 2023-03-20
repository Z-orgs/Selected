import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MxzService } from 'src/mxz/mxz.service';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { Artist } from './model/artist.model';

@Injectable()
export class ArtistService {
  private readonly level = 'artist';
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly mxzService: MxzService,
  ) {}
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
    } as Track);
    track.save();
    this.mxzService.createMxz({
      level: this.level,
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
        level: this.level,
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
}
