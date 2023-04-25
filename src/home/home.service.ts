import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
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
    let randomAlbums: any, randomTracks: any, albums: any[], tracks: any[];
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
    }

    const albumsNF = await this.albumModel.find({ public: true });
    const tracksNF = await this.trackModel.find({ public: true, status: true });
    let randomAlbumsNF: (Document<unknown, any, Album> &
        Omit<Album & { _id: Types.ObjectId }, never> &
        Required<{ _id: Types.ObjectId }>)[],
      randomTracksNF: (Document<unknown, any, Track> &
        Omit<Track & { _id: Types.ObjectId }, never> &
        Required<{ _id: Types.ObjectId }>)[];
    if (albumsNF.length <= 5) {
      randomAlbumsNF = albumsNF;
    } else {
      randomAlbumsNF = albumsNF.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    if (tracksNF.length <= 5) {
      randomTracksNF = tracksNF;
    } else {
      randomTracksNF = tracksNF.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    return {
      Following: { randomAlbums, randomTracks },
      NoFollowing: { randomAlbumsNF, randomTracksNF },
    };
  }
}
