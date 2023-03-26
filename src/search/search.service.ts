import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { Track, TrackDocument } from '../track/model/track.model';
import { Album, AlbumDocument } from '../album/model/album.model';
import { Playlist, PlaylistDocument } from '../playlist/model/playlist.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
  ) {}

  async search(keyword: string) {
    const regex = new RegExp(keyword, 'i');

    const [tracks, albums, artists, playlists] = await Promise.all([
      this.trackModel
        .find({ title: regex, status: 'approved' })
        .sort({ createdAt: 'desc' })
        .select('_id title artist'),

      this.albumModel
        .find({ title: regex, public: true })
        .sort({ createdAt: 'desc' })
        .select('_id title artist'),

      this.artistModel
        .find({ nickName: regex })
        .sort({ createdAt: 'desc' })
        .select('_id nickName'),

      this.playlistModel
        .find({ title: regex })
        .sort({ createdAt: 'desc' })
        .select('_id title'),
    ]);

    return {
      tracks: tracks.map((track) => ({
        id: track._id,
        title: track.title,
        artist: track.artist,
      })),
      albums: albums.map((album) => ({
        id: album._id,
        title: album.title,
        artist: album.artist,
      })),
      artists: artists.map((artist) => ({
        id: artist._id,
        nickName: artist.nickName,
      })),
      playlists: playlists.map((playlist) => ({
        id: playlist._id,
        title: playlist.title,
      })),
    };
  }
}
