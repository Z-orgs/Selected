import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-dto';
import { Album, AlbumDocument } from './model/album.model';
import { InjectModel } from '@nestjs/mongoose';
import { env } from 'src/m/x/z/a/s/p/i/r/e/env';
import { LoggerService } from '../logger/logger.service';
import { Track, TrackDocument } from 'src/track/model/track.model';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  createAlbum(
    imageId: Types.ObjectId,
    user: Artist,
    createAlbum: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      coverArtUrl: imageId.toString(),
      artist: user.username,
      ...createAlbum,
    } as Album);
    album.save();
    this.loggerService.createLogger({
      level: env.Artist,
      username: user.username,
      log: `${user.username} has created album ${album._id}`,
    });
    return album;
  }

  async updateAlbum(
    id: string,
    image: Types.ObjectId,
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
    await this.albumModel.updateOne({ _id: id }, {
      ...updateAlbum,
      coverArtUrl: image ? image : album.coverArtUrl,
    } as Album);
    this.loggerService.createLogger({
      level: env.Artist,
      username: user.username,
      log: `${user.username} has updated the information of album ${id}`,
    });
    return new HttpException('Updated album', HttpStatus.ACCEPTED);
  }
  async getAlbumsById(id: string) {
    const album = await this.albumModel.findById(id);
    const tracks = await Promise.all(
      album.tracks.map(async (track) => {
        return await this.trackModel.findById(track);
      }),
    );
    const artist = await this.artistModel.findById(album.artist);
    return { ...album, tracks, artist };
  }
}
