import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { User, UserDocument } from 'src/user/model/user.model';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getHomePage(user: User) {
    const { following } = await this.userModel
      .findOne({ email: user.email }, 'following')
      .lean();

    let randomAlbums,
      randomTracks,
      albums,
      tracks = [];

    if (following.length) {
      const artists = await this.userModel
        .find({ _id: { $in: following } })
        .select('email')
        .lean();

      [albums, tracks] = await Promise.all([
        this.albumModel
          .find({
            artist: { $in: artists.map((a) => a.email) },
            isPublic: true,
          })
          .lean(),

        this.trackModel
          .find({
            artist: { $in: artists.map((a) => a.email) },
            isPublic: true,
            status: true,
          })
          .lean(),
      ]);

      randomAlbums = albums
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(albums.length, 15));
      randomTracks = tracks
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(tracks.length, 15));
    }

    const [albumsNF, tracksNF]: any = await Promise.all([
      this.albumModel.find({ isPublic: true }).lean(),
      this.trackModel.find({ isPublic: true, status: true }).lean(),
    ]);

    let randomAlbumsNF = albumsNF
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(albumsNF.length, 15));
    let randomTracksNF = tracksNF
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(tracksNF.length, 15));

    randomAlbums = await this.addArtistToElements(randomAlbums);
    randomTracks = await this.addArtistToElements(randomTracks);
    randomAlbumsNF = await this.addArtistToElements(randomAlbumsNF);
    randomTracksNF = await this.addArtistToElements(randomTracksNF);

    return {
      Following: { randomAlbums, randomTracks },
      NoFollowing: { randomAlbumsNF, randomTracksNF },
    };
  }
  async addArtistToElements(elements) {
    if (!elements || !elements.length) {
      return [];
    }
    for (let i = 0; i < elements.length; i++) {
      const artist = (
        await this.userModel.findOne({ email: elements[i].author })
      ).toObject();
      elements[i].artist = { ...artist, refreshTokens: undefined };
    }
    return elements;
  }
}
