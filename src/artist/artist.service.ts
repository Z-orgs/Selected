import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin } from 'src/admin/model/admin.model';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from './model/artist.model';
import { MXZ, env } from 'src/m/x/z/a/s/p/i/r/e/env';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ChangePasswordDto } from 'src/admin/dto/change-password.dto';
import { LoggerService } from '../logger/logger.service';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Track, TrackDocument } from 'src/track/model/track.model';
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
      nickNameUnaccented: MXZ(createArtist.nickName),
    } as Artist);
    artist.save();
    this.loggerService.createLogger({
      level: env.Admin,
      username: user.username,
      log: `${user.username} has created artist ${artist.username}`,
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
      nickNameUnaccented: MXZ(updateArtist.nickName),
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
    const artist = await this.artistModel.findById(id).select('-password');
    const albums = await this.albumModel
      .find({ artist: artist.username, public: true })
      .sort({ createdAt: 'desc' });
    const tracks = await this.trackModel
      .find({
        artist: artist.username,
        status: true,
        public: true,
      })
      .sort({ createdAt: 'desc' });
    return { artist, albums, tracks };
  }
  async getAllAlbums(user: Artist) {
    const albums = await this.albumModel
      .find({ artist: user.username })
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      albums.map((album) => {
        return {
          _id: album._id,
          title: album.title,
          tracks: album.tracks.length,
        };
      }),
    );
  }
  async getAlbumById(id: string) {
    const album = await this.albumModel.findById(id);
    const tracks = await Promise.all(
      album.tracks.map((track) => {
        return this.getTrackById(track);
      }),
    );
    return { ...album.toObject(), tracks };
  }
  async getTrackById(id: string) {
    const track = await this.trackModel.findById(id);
    return {
      ...track.toObject(),
      link: `${env.UrlServer}/file/${track.fileId}`,
    };
  }
  async getAllTracks(user: Artist) {
    const tracks = await this.trackModel
      .find({ artist: user.username })
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      tracks.map(async (track) => {
        const artist = await this.artistModel.findOne({
          username: track.artist,
        });
        return { _id: track._id, artist: artist.nickName, title: track.title };
      }),
    );
  }
  async resetPassword(user: Admin, username: string) {
    await this.artistModel.updateOne(
      { username },
      { password: env.DefaultPassword },
    );
    this.loggerService.createLogger({
      level: env.Admin,
      username: user.username,
      log: `${user.username} has reset password for artist ${username}`,
    });
    return new HttpException('Reset', HttpStatus.ACCEPTED);
  }
}
