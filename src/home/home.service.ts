import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { ArtistService } from 'src/artist/artist.service';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { Playlist, PlaylistDocument } from 'src/playlist/model/playlist.model';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { User, UserDocument } from 'src/user/model/user.model';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async getHomePage(user: User) {
    const following = (
      await this.userModel.findOne({ email: user.email })
    ).toObject().following;
    let randomAlbums,
      randomTracks,
      albums = [],
      tracks = [];
    if (following.length) {
      const artists = await Promise.all(
        following.map(async (artist) => {
          return await this.artistModel.findById(artist).select('username');
        }),
      );
      albums = await Promise.all(
        artists.map(async (artist) => {
          return await this.albumModel.find({
            artist: artist.username,
            public: true,
          });
        }),
      );
      albums = albums.flat();
      tracks = await Promise.all(
        artists.map(async (artist) => {
          return await this.trackModel.find({
            artist: artist.username,
            public: true,
            status: true,
          });
        }),
      );
      tracks = tracks.flat();
    } else {
      albums = await this.albumModel.find({ public: true });
      tracks = await this.trackModel.find({ public: true, status: true });
    }
    if (albums.length <= 5) {
      randomAlbums = albums;
    } else {
      randomAlbums = albums.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    if (tracks.length <= 5) {
      randomTracks = tracks;
    } else {
      randomTracks = tracks.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    return { randomAlbums, randomTracks };
  }
}
