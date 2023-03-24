import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/model/user.model';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './model/playlist.model';
import { Model } from 'mongoose';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  createPlaylist(user: User, createPlaylist: CreatePlaylistDto) {
    const playlist = new this.playlistModel({
      ...createPlaylist,
      owner: user.email,
    } as Playlist);
    playlist.save();
    this.loggerService.createLogger({
      level: 'user',
      username: user.email,
      log: `${user.email} has created playlist ${playlist._id}`,
    });
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
    this.loggerService.createLogger({
      level: 'user',
      username: user.email,
      log: `${user.email} has added track ${trackId} to playlist ${id}`,
    });
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
    this.loggerService.createLogger({
      level: 'user',
      username: user.email,
      log: `${user.email} has deleted playlist ${id}`,
    });
    return new HttpException('Deleted', HttpStatus.ACCEPTED);
  }
}
