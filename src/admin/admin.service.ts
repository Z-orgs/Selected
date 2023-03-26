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

  getAllAdmins() {
    return this.adminModel.find();
  }

  getAllArtists() {
    return this.artistModel.find();
  }

  getAllTracks() {
    return this.trackModel.find();
  }

  getAllAlbums() {
    return this.albumModel.find();
  }

  getAllPlaylists() {
    return this.playlistModel.find();
  }

  getAllLoggers() {
    return this.loggerModel.find();
  }

  getALlUsers() {
    return this.userModel.find();
  }
}
