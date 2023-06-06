import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { Track, TrackDocument } from './model/track.model';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { CreateTrackDto } from './dto/create-track.dto';
import { Admin } from 'src/admin/model/admin.model';
import { LoggerService } from '../logger/logger.service';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Playlist, PlaylistDocument } from 'src/playlist/model/playlist.model';
import { SELECTED, normalString } from 'src/constants';
import { User, UserDocument } from 'src/user/model/user.model';
import { NextTrackDto } from './dto/next.track.dto';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly loggerService: LoggerService,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  upload(user: Artist, responses: any[], createTrack: CreateTrackDto) {
    const track = new this.trackModel({
      filename: responses[0].filename,
      uploaded: new Date(),
      fileId: responses[0].filename,
      path: `./data/filesElected/${responses[0].filename}`,
      status: false,
      artist: user.username,
      ...createTrack,
      titleUnaccented: normalString(createTrack.title),
    } as Track);
    track.save();
    const log = {
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has uploaded track ${track._id}`,
    };
    this.loggerService.createLogger(log);
    this.notificationGateway.sendNotification(log);
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
      await this.trackModel.updateOne({ _id: id }, {
        ...updateInfoTrack,
        titleUnaccented: normalString(updateInfoTrack.title),
      } as Track);
      const log = {
        level: SELECTED.Artist,
        username: user.username,
        log: `${user.username} has updated the information of track ${id}`,
      };
      this.loggerService.createLogger(log);
      this.notificationGateway.sendNotification(log);
      return new HttpException(`Updated track ${id}`, HttpStatus.ACCEPTED);
    } catch (err) {
      return new HttpException(
        `Update failed track ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStatusTrack(id: string, user: Admin) {
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
        username: user.username,
        log: `${user.username} has updated the status of the track ${id} from ${
          track.status
        } to ${!track.status}`,
      };
      this.loggerService.createLogger(log);
      this.notificationGateway.sendNotification(log);
      return new HttpException('Status update successful', HttpStatus.ACCEPTED);
    } else {
      await this.trackModel.findByIdAndUpdate({ _id: id }, { status: false });
      const log = {
        level: SELECTED.Admin,
        username: user.username,
        log: `${user.username} has updated the status of the track ${id} from ${
          track.status
        } to ${!track.status}`,
      };
      this.loggerService.createLogger(log);
      this.notificationGateway.sendNotification(log);
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

    const artist = await this.artistModel
      .findOne({ username: track.artist })
      .select('-password');
    return {
      ...track.toObject(),
      liked: currentUser.liked.indexOf(id) !== -1,
      artist,
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
}
