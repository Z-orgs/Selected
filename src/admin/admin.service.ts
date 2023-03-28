import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { env } from 'src/m/x/z/a/s/p/i/r/e/env';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin, AdminDocument } from './model/admin.model';
import { LoggerService } from '../logger/logger.service';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { Track, TrackDocument } from '../track/model/track.model';
import { Album, AlbumDocument } from '../album/model/album.model';
import { Playlist, PlaylistDocument } from '../playlist/model/playlist.model';
import { Logger, LoggerDocument } from '../logger/model/logger.model';
import { User, UserDocument } from '../user/model/user.model';
import { Types } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<LoggerDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createAdmin(user: Admin, createAdmin: CreateAdminDto) {
    const admin = await this.adminModel.findOne({
      username: createAdmin.username,
    });
    if (!admin) {
      await new this.adminModel({ ...createAdmin } as Admin).save();
      this.loggerService.createLogger({
        level: env.Admin,
        username: user.username,
        log: `${user.username} created admin ${createAdmin.username}`,
      });
      return new HttpException('Created admin', HttpStatus.ACCEPTED);
    }
    return new HttpException('Admin already exist', HttpStatus.BAD_REQUEST);
  }

  async changePassword(user: Admin, changePassword: ChangePasswordDto) {
    if (changePassword.newPassword !== changePassword.confirmNewPassword) {
      return new HttpException(
        `The new password and the password confirmation do not match`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const admin = await this.adminModel.findOne({
      username: user.username,
      password: changePassword.password,
    });
    if (!admin) {
      return new HttpException(
        `The old password is incorrect`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.adminModel.findOneAndUpdate(
      { username: user.username },
      { password: changePassword.newPassword },
    );
    this.loggerService.createLogger({
      level: env.Admin,
      username: user.username,
      log: `${user.username} changed password.`,
    });
    return new HttpException(
      `Password changed successfully`,
      HttpStatus.ACCEPTED,
    );
  }

  async resetPassword(user: Admin, username: string) {
    const admin = await this.adminModel.findOne({ username });
    if (!admin) {
      return new HttpException(
        `This admin does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.adminModel.findOneAndUpdate(
      { username },
      { password: env.DefaultPassword },
    );
    this.loggerService.createLogger({
      level: env.Admin,
      username: user.username,
      log: `${user.username} reset password for ${username}`,
    });
    return new HttpException(`Password reset successful`, HttpStatus.ACCEPTED);
  }

  async getAllAdmins() {
    const admins = await this.adminModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      admins.map((admin) => {
        return { ...admin.toObject() };
      }),
    );
  }

  async getAllArtists() {
    const artists = await this.artistModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      artists.map((artist) => {
        return {
          _id: artist._id,
          profileImage: artist.profileImage,
          nickName: artist.nickName,
          username: artist.username,
        };
      }),
    );
  }

  async getAllTracks() {
    const tracks = await this.trackModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      tracks.map(async (track) => {
        const artist = await this.artistModel.findOne({
          username: track.artist,
        });
        return { _id: track._id, artist: artist.nickName, title: track.title };
      }),
    );
  }

  async getAllAlbums() {
    const albums = await this.albumModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      albums.map(async (album) => {
        return {
          _id: album._id,
          title: album.title,
          tracks: album.tracks.length,
        };
      }),
    );
  }

  async getAllPlaylists() {
    const playlists = await this.playlistModel
      .find()
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      playlists.map(async (playlist) => {
        return {
          _id: playlist._id,
          title: playlist.title,
          owner: playlist.owner,
        };
      }),
    );
  }

  getAllLoggers() {
    return this.loggerModel.find().sort({ createdAt: 'desc' });
  }

  getALlUsers() {
    return this.userModel.find().sort({ createdAt: 'desc' });
  }

  async getTrackById(id: string) {
    const track = await this.trackModel.findById(id);
    return {
      ...track.toObject(),
      link: `${env.UrlServer}/file/${track.fileId}`,
    };
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
  async getPlaylistById(id: string) {
    const playlist = await this.playlistModel.findById(id);
    const tracks = await Promise.all(
      playlist.tracks.map((track) => {
        return this.getTrackById(track);
      }),
    );
    return { ...playlist.toObject(), tracks };
  }
  async getAdminById(id: string) {
    const admin = await this.adminModel.findById(id);
    return { ...admin.toObject() };
  }
}
