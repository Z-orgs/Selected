import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album-dto';
import { Album, AlbumDocument } from './model/album.model';
import { InjectModel } from '@nestjs/mongoose';
import { LoggerService } from '../logger/logger.service';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { SELECTED, normalString } from 'src/constants';
import { User, UserDocument } from '../user/model/user.model';
import { ReqUser } from 'src/global';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly loggerService: LoggerService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  createAlbum(imageId: string, user: ReqUser, createAlbum: CreateAlbumDto) {
    const album = new this.albumModel({
      coverArtUrl: imageId.toString(),
      author: user.email,
      ...createAlbum,
      tracks: JSON.parse(createAlbum.tracks) as string[],
      titleUnaccented: normalString(createAlbum.title),
    } as Album);
    album.save();
    const log = {
      level: SELECTED.Artist,
      email: user.email,
      log: `${user.email} has created album ${album._id}`,
    };
    this.loggerService.createLogger(log);
    return album;
  }

  async updateAlbum(
    id: string,
    image: string,
    user: ReqUser,
    updateAlbum: UpdateAlbumDto,
  ) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException(
        'This album does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (album.author !== user.email) {
      return new HttpException('No permission', HttpStatus.CONFLICT);
    }
    const tracks: string[] = [];
    for (const trackId of JSON.parse(updateAlbum.tracks) as string[]) {
      if (await this.trackModel.findById(trackId)) {
        tracks.push(trackId);
      }
    }
    await this.albumModel.updateOne({ _id: id }, {
      ...updateAlbum,
      tracks,
      coverArtUrl: image ? image : album.coverArtUrl,
      titleUnaccented: normalString(updateAlbum.title),
    } as Album);
    const log = {
      level: SELECTED.Artist,
      email: user.email,
      log: `${user.email} has updated the information of album ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Updated album', HttpStatus.ACCEPTED);
  }
  async getAlbumsById(id: string) {
    const album = await this.albumModel.findOne({ _id: id, isPublic: true });
    if (!album) {
      return new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    const tracks = await Promise.all(
      album.tracks.map(async (track) => {
        return await this.trackModel.findOne({
          _id: track,
          isPublic: true,
          status: true,
        });
      }),
    );
    const artist = await this.userModel.findOne({ email: album.author });

    delete artist.refreshTokens;

    return { ...album.toObject(), tracks, artist };
  }
  async deleteAlbum(artist: ReqUser, id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException('Album not found', HttpStatus.BAD_REQUEST);
    }
    if (album.author === artist.email) {
      await this.albumModel.findByIdAndDelete(id);
      const log = {
        level: SELECTED.Artist,
        email: artist.email,
        log: `${artist.email} has deleted album ${id}`,
      };
      this.loggerService.createLogger(log);
      return { success: true };
    } else {
      return { success: false, message: 'Unauthorized' };
    }
  }
}
