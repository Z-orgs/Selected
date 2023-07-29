import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../track/model/track.model';
import { Album, AlbumDocument } from '../album/model/album.model';
import { Playlist, PlaylistDocument } from '../playlist/model/playlist.model';
import { normalString } from 'src/constants';
import { User, UserDocument } from '../user/model/user.model';
import { ReqUser } from 'src/global';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
  ) {}

  async search(keyword: string) {
    const regex = new RegExp(normalString(keyword), 'gi');

    const [tracks, albums, artists, playlists] = await Promise.all([
      this.trackModel
        .find({ titleUnaccented: regex, status: true, isPublic: true })
        .sort({ createdAt: 'desc' }),

      this.albumModel
        .find({ titleUnaccented: regex, isPublic: true })
        .sort({ createdAt: 'desc' })
        .select('_id title artist coverArtUrl'),

      this.userModel
        .find({ nickNameUnaccented: regex })
        .sort({ createdAt: 'desc' })
        .select('_id nickName profileImage'),

      this.playlistModel
        .find({ titleUnaccented: regex })
        .sort({ createdAt: 'desc' })
        .select('_id title'),
    ]);

    return {
      tracks,
      albums: albums.map((album) => ({
        _id: album._id,
        title: album.title,
        artist: album.author,
        coverArtUrl: album.coverArtUrl,
      })),
      artists: artists.map((artist) => ({
        _id: artist._id,
        nickName: artist.nickName,
        profileImage: artist.profileImage,
      })),
      playlists: playlists.map((playlist) => ({
        _id: playlist._id,
        title: playlist.title,
      })),
    };
  }
  async searchTrack(user: ReqUser, keyword: string) {
    const regex = new RegExp(normalString(keyword), 'gi');
    const tracks = await this.trackModel
      .find({
        titleUnaccented: regex,
        status: true,
        isPublic: true,
        artist: user.email,
      })
      .sort({ createdAt: 'desc' })
      .select('_id title artist');
    return await Promise.all(
      tracks.map((track) => ({
        _id: track._id,
        title: track.title,
      })),
    );
  }
}
