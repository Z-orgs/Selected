import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/model/user.model';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './model/playlist.model';
import { Model } from 'mongoose';
import { LoggerService } from '../logger/logger.service';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { normalString } from 'src/constants';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  createPlaylist(user: User, createPlaylist: CreatePlaylistDto) {
    const playlist = new this.playlistModel({
      ...createPlaylist,
      tracks: JSON.parse(createPlaylist.tracks) as string[],
      owner: user.email,
      titleUnaccented: normalString(createPlaylist.title),
    } as Playlist);
    playlist.save();
    const log = {
      level: 'user',
      email: user.email,
      log: `${user.email} has created playlist ${playlist._id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Created playlist', HttpStatus.ACCEPTED);
  }

  async addTrackToPlaylist(user: User, trackId: string, id: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      return new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
    if (playlist.owner !== user.email) {
      return new HttpException(
        `You’re not the owner of this playlist`,
        HttpStatus.CONFLICT,
      );
    }
    await this.playlistModel.updateOne(
      { _id: id },
      {
        $addToSet: { tracks: trackId },
      },
    );
    const log = {
      level: 'user',
      email: user.email,
      log: `${user.email} has added track ${trackId} to playlist ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Added', HttpStatus.ACCEPTED);
  }

  async deletePlaylist(user: User, id: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      return new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
    if (playlist.owner !== user.email) {
      return new HttpException(
        `You’re not the owner of this playlist`,
        HttpStatus.CONFLICT,
      );
    }
    await this.playlistModel.deleteOne({ _id: id, owner: user.email });
    const log = {
      level: 'user',
      email: user.email,
      log: `${user.email} has deleted playlist ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Deleted', HttpStatus.ACCEPTED);
  }
  async getPlaylistById(id: string) {
    const playlist = await this.playlistModel.findById(id);
    const tracks = await Promise.all(
      playlist.tracks.map(async (track) => {
        return await this.trackModel.findOne({
          _id: track,
          status: true,
          isPublic: true,
        });
      }),
    );
    return { ...playlist.toObject(), tracks };
  }
  async deleteTrackFromPlaylist(user: User, trackId: string, id: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      return new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
    if (playlist.owner !== user.email) {
      return new HttpException(
        `You’re not the owner of this playlist`,
        HttpStatus.CONFLICT,
      );
    }
    await this.playlistModel.updateOne(
      { _id: id },
      {
        $pull: { tracks: trackId },
      },
    );
    const log = {
      level: 'user',
      email: user.email,
      log: `${user.email} has added track ${trackId} to playlist ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Deleted', HttpStatus.ACCEPTED);
  }
  async getAllPlaylistAsUser(user: User) {
    return await this.playlistModel.find({ owner: user.email });
  }
}
