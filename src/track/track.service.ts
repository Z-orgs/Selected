import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { Track, TrackDocument } from './model/track.model';
import { CreateTrackDto } from './dto/create-track.dto';
import { LoggerService } from '../logger/logger.service';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Playlist, PlaylistDocument } from 'src/playlist/model/playlist.model';
import { SELECTED, normalString } from 'src/constants';
import { User, UserDocument } from 'src/user/model/user.model';
import { NextTrackDto } from './dto/next.track.dto';
import getAudioDurationInSeconds from 'get-audio-duration';
import { existsSync, unlinkSync } from 'fs';
import { ReqUser } from 'src/global';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly loggerService: LoggerService,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async upload(user: ReqUser, responses: any[], createTrack: CreateTrackDto) {
    const track = new this.trackModel({
      filename: responses[0].filename,
      uploaded: new Date(),
      fileId: responses[0].filename,
      path: `./data/filesElected/${responses[0].filename}`,
      status: false,
      author: user.email,
      ...createTrack,
      titleUnaccented: normalString(createTrack.title),
    } as Track);
    await track.save();
    const log = {
      level: SELECTED.Artist,
      email: user.email,
      log: `${user.email} has uploaded track ${track._id}`,
    };
    this.loggerService.createLogger(log);
    if (existsSync(`./data/filesElected/${responses[0].filename}`)) {
      await this.trackModel.updateOne(
        { fileId: responses[0].filename },
        {
          duration: await getAudioDurationInSeconds(
            `./data/filesElected/${responses[0].filename}`,
          ),
        },
      );
    }
    return track;
  }

  async updateInfoTrack(
    user: ReqUser,
    id: string,
    updateInfoTrack: UpdateInfoTrackDto,
  ) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.trackModel.updateOne({ _id: id }, {
        ...updateInfoTrack,
        titleUnaccented: normalString(updateInfoTrack.title),
      } as Track);
      const log = {
        level: SELECTED.Artist,
        email: user.email,
        log: `${user.email} has updated the information of track ${id}`,
      };
      this.loggerService.createLogger(log);
      return new HttpException(`Updated track ${id}`, HttpStatus.ACCEPTED);
    } catch (err) {
      return new HttpException(
        `Update failed track ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStatusTrack(id: string, user: ReqUser) {
    const track = await this.trackModel.findById({
      _id: id,
    });
    if (!track) {
      return new HttpException(
        `This track does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!track.status) {
      await this.trackModel.findByIdAndUpdate({ _id: id }, { status: true });
      const log = {
        level: SELECTED.Admin,
        email: user.email,
        log: `${user.email} has updated the status of the track ${id} from ${
          track.status
        } to ${!track.status}`,
      };
      this.loggerService.createLogger(log);
      return new HttpException('Status update successful', HttpStatus.ACCEPTED);
    } else {
      await this.trackModel.findByIdAndUpdate({ _id: id }, { status: false });
      const log = {
        level: SELECTED.Admin,
        email: user.email,
        log: `${user.email} has updated the status of the track ${id} from ${
          track.status
        } to ${!track.status}`,
      };
      this.loggerService.createLogger(log);
      return new HttpException('Status update successful', HttpStatus.ACCEPTED);
    }
  }
  async getTrackById(user: User, id: string) {
    const track = await this.trackModel.findOne({
      _id: id,
      status: true,
      isPublic: true,
    });
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();

    const artist = await this.userModel.findOne({ email: track.author });
    return {
      ...track.toObject(),
      liked: currentUser.liked.indexOf(id) !== -1,
      artist: {
        ...artist,
        refreshTokens: undefined,
      },
    };
  }
  async nextTrack(user: User, nextMessage: NextTrackDto) {
    let nextTrack: string = nextMessage.currentTrackId;
    await this.userModel.updateOne(
      { email: user.email },
      {
        $push: {
          prev: nextMessage.currentTrackId,
        },
      },
    );
    if (nextMessage.album) {
      try {
        const album = await this.albumModel.findById(nextMessage.album);
        const nextIndex =
          album.tracks.length - 1 ===
          album.tracks.indexOf(nextMessage.currentTrackId)
            ? 0
            : album.tracks.indexOf(nextMessage.currentTrackId) + 1;
        nextTrack = album.tracks[nextIndex];
      } catch (err) {
        const tracks = await this.trackModel.find({
          status: true,
          isPublic: true,
        });
        while (nextMessage.currentTrackId === nextTrack) {
          const randomIndex = Math.floor(Math.random() * tracks.length);
          nextTrack = tracks[randomIndex]._id.toString();
        }
      }
    } else if (nextMessage.playlist) {
      try {
        const playlist = await this.playlistModel.findById(
          nextMessage.playlist,
        );
        const nextIndex =
          playlist.tracks.length - 1 ===
          playlist.tracks.indexOf(nextMessage.currentTrackId)
            ? 0
            : playlist.tracks.indexOf(nextMessage.currentTrackId) + 1;
        nextTrack = playlist.tracks[nextIndex];
      } catch (err) {
        const tracks = await this.trackModel.find({
          status: true,
          isPublic: true,
        });
        while (nextMessage.currentTrackId === nextTrack) {
          const randomIndex = Math.floor(Math.random() * tracks.length);
          nextTrack = tracks[randomIndex]._id.toString();
        }
      }
    } else {
      const tracks = await this.trackModel.find({
        status: true,
        isPublic: true,
      });
      while (nextMessage.currentTrackId === nextTrack) {
        const randomIndex = Math.floor(Math.random() * tracks.length);
        nextTrack = tracks[randomIndex]._id.toString();
      }
    }
    return nextTrack;
  }
  async prevTrack(user: User) {
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();
    const prevId = currentUser.prev[-1] ? currentUser.prev[-1] : undefined;
    if (prevId) {
      await this.userModel.updateOne(
        { email: user.email },
        {
          $pop: {
            prev: 1,
          },
        },
      );
    }
    return prevId;
  }
  async deleteTrack(artist: ReqUser, id: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      return new HttpException('Track not found', HttpStatus.BAD_REQUEST);
    }
    if (track.author !== artist.email) {
      return new HttpException('No permission', HttpStatus.BAD_REQUEST);
    }
    await this.albumModel.updateMany(
      { tracks: { $in: [id] } },
      { $pull: { tracks: id } },
    );
    await this.playlistModel.updateMany(
      { tracks: { $in: [id] } },
      { $pull: { tracks: id } },
    );
    if (existsSync(track.path)) {
      unlinkSync(track.path);
    }
    await this.trackModel.deleteOne({ _id: id });
    const log = {
      level: SELECTED.Artist,
      email: artist.email,
      log: `${artist.email} has deleted track ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Deleted', HttpStatus.ACCEPTED);
  }
}
