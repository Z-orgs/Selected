import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/model/user.model';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './model/playlist.model';
import { Model } from 'mongoose';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
  ) {}
  createPlaylist(user: User, createPlaylist: CreatePlaylistDto) {
    new this.playlistModel({
      ...createPlaylist,
      owner: user.email,
    } as Playlist).save();
    return new HttpException('Created playlist', HttpStatus.ACCEPTED);
  }
  async addTrackToPlaylist(user: User, trackId: string, id: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      return new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
    await this.playlistModel.updateOne(
      { _id: id },
      {
        $addToSet: { tracks: trackId },
      },
    );
  }
}
