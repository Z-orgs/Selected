import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-dto';
import { Album, AlbumDocument } from './model/album.model';
import { InjectModel } from '@nestjs/mongoose';
import { LoggerService } from '../logger/logger.service';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { SELECTED, normalString } from 'src/constants';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  createAlbum(imageId: string, user: Artist, createAlbum: CreateAlbumDto) {
    const album = new this.albumModel({
      coverArtUrl: imageId.toString(),
      artist: user.username,
      ...createAlbum,
      tracks: JSON.parse(createAlbum.tracks) as string[],
      titleUnaccented: normalString(createAlbum.title),
    } as Album);
    album.save();
    this.loggerService.createLogger({
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has created album ${album._id}`,
    });
    return album;
  }

  async updateAlbum(
    id: string,
    image: string,
    user: Artist,
    updateAlbum: UpdateAlbumDto,
  ) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException(
        'This album does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (album.artist !== user.username) {
      return new HttpException('No permission', HttpStatus.CONFLICT);
    }
    await this.albumModel.updateOne({ _id: id }, {
      ...updateAlbum,
      coverArtUrl: image ? image : album.coverArtUrl,
      titleUnaccented: normalString(updateAlbum.title),
    } as Album);
    this.loggerService.createLogger({
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has updated the information of album ${id}`,
    });
    return new HttpException('Updated album', HttpStatus.ACCEPTED);
  }
  async getAlbumsById(id: string) {
    const album = await this.albumModel.findOne({ _id: id, public: true });
    if (!album) {
      return new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const tracks = await Promise.all(
      album.tracks.map(async (track) => {
        return await this.trackModel.findOne({
          _id: track,
          public: true,
          status: true,
        });
      }),
    );
    const artist = await this.artistModel
      .findOne({ artist: album.artist })
      .select('-password');
    return { ...album.toObject(), tracks, artist };
  }
  async addTrackToAlbum(id: string, trackId: string, user: Artist) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    if (album.artist !== user.username) {
      return new HttpException('No permission', HttpStatus.CONFLICT);
    }
    const track = await this.trackModel.findOne({
      _id: trackId,
      status: true,
      public: true,
      artist: user.username,
    });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    if (album.tracks.includes(trackId)) {
      return new HttpException(
        'Track already exist in this album',
        HttpStatus.CONFLICT,
      );
    }
    await this.trackModel.updateOne(
      { _id: trackId },
      {
        album: id,
      },
    );
    await this.albumModel.updateOne(
      { _id: id },
      { $addToSet: { tracks: trackId } },
    );
    this.loggerService.createLogger({
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has added track ${trackId} to album ${id}`,
    });
    return new HttpException('Added', HttpStatus.ACCEPTED);
  }
  async deleteTrackToAlbum(id: string, trackId: string, user: Artist) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    if (album.artist !== user.username) {
      return new HttpException('No permission', HttpStatus.CONFLICT);
    }
    const track = await this.trackModel.findOne({
      _id: trackId,
      status: true,
      public: true,
      artist: user.username,
    });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    await this.trackModel.updateOne(
      { _id: trackId },
      {
        album: null,
      },
    );
    await this.albumModel.updateOne(
      { _id: id },
      { $pull: { tracks: trackId } },
    );
    this.loggerService.createLogger({
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has deleted track ${trackId} from album ${id}`,
    });
    return new HttpException('deleted', HttpStatus.ACCEPTED);
  }
}
