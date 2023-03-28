import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin } from 'src/admin/model/admin.model';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Artist, ArtistDocument } from './model/artist.model';
import { env } from 'src/m/x/z/a/s/p/i/r/e/env';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ChangePasswordDto } from 'src/admin/dto/change-password.dto';
import { LoggerService } from '../logger/logger.service';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { json } from 'stream/consumers';
import { SocialLink } from './dto/social.links';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  async createArtist(user: Admin, createArtist: CreateArtistDto) {
    if (await this.artistModel.findOne({ username: createArtist.username })) {
      return new HttpException(
        `Username already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = new this.artistModel({
      ...createArtist,
      followers: 0,
    } as Artist);
    artist.save();
    this.loggerService.createLogger({
      level: env.Admin,
      username: user.username,
      log: `${user.username} has created artist ${artist._id}`,
    });
    return new HttpException('Created artist.', HttpStatus.ACCEPTED);
  }

  async updateArtist(
    user: Artist,
    updateArtist: UpdateArtistDto,
    imageId: string,
  ) {
    const artist = await this.artistModel.findOne({ username: user.username });
    await this.artistModel.updateOne({ username: user.username }, {
      ...updateArtist,
      socialLinks: JSON.parse(updateArtist.socialLinks) as SocialLink[],
      profileImage: imageId ? imageId : artist.profileImage,
    } as Artist);
    this.loggerService.createLogger({
      level: env.Artist,
      username: user.username,
      log: `${user.username} has updated information`,
    });
    return new HttpException('Updated', HttpStatus.ACCEPTED);
  }

  async changePassword(user: Artist, changePassword: ChangePasswordDto) {
    const artist = await this.artistModel.findOne({ username: user.username });
    if (artist.password !== changePassword.password) {
      return new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }
    if (changePassword.newPassword !== changePassword.confirmNewPassword) {
      return new HttpException(
        'New password and password confirmation do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.artistModel.updateOne({ username: user.username }, {
      password: changePassword.newPassword,
    } as Artist);
    this.loggerService.createLogger({
      level: env.Artist,
      username: user.username,
      log: `${user.username} has changed password`,
    });
    return new HttpException(
      'Password changed successfully',
      HttpStatus.ACCEPTED,
    );
  }
  async getArtistById(id: string) {
    const artist = await this.artistModel.findById(id);
    const albums = await this.albumModel
      .find({ artist: id, public: true })
      .sort({ createdAt: 'desc' });
    const tracks = await this.trackModel
      .find({
        artist: id,
        status: true,
        public: true,
      })
      .sort({ createdAt: 'desc' });
    return { artist, albums, tracks };
  }
}
