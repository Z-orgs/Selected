import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { SELECTED } from 'src/constants';
import { compare, genSalt, hash } from 'bcrypt';
import { existsSync, unlinkSync } from 'fs';

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
      const newAdmin = new this.adminModel({ ...createAdmin } as Admin);

      newAdmin.salt = await genSalt();

      newAdmin.password = await hash(createAdmin.password, newAdmin.salt);
      await newAdmin.save();
      const log = {
        level: SELECTED.Admin,
        username: user.username,
        log: `${user.username} created admin ${createAdmin.username}`,
      };
      this.loggerService.createLogger(log);
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
    });
    if (!admin) {
      return new HttpException(`Admin not found.`, HttpStatus.BAD_REQUEST);
    }
    if (!(await compare(changePassword.password, admin.password))) {
      return new HttpException(
        `The old password is incorrect.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.adminModel.updateOne({
      username: admin.username,
      password: await hash(changePassword.newPassword, admin.salt),
    });
    const log = {
      level: SELECTED.Admin,
      username: user.username,
      log: `${user.username} changed password.`,
    };
    this.loggerService.createLogger(log);
    return new HttpException(
      `Password changed successfully`,
      HttpStatus.ACCEPTED,
    );
  }

  async resetPassword(user: Admin, id: string) {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      return new HttpException(
        `This admin does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    // await this.adminModel.findByIdAndUpdate(id, {
    //   password: SELECTED.DefaultPassword,
    // });
    await this.adminModel.updateOne(
      { _id: id },
      {
        password: await hash(SELECTED.DefaultPassword, admin.salt),
      },
    );
    const log = {
      level: SELECTED.Admin,
      username: user.username,
      log: `${user.username} reset password for ${admin.username}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException(`Password reset successful`, HttpStatus.ACCEPTED);
  }

  async getAllAdmins() {
    const admins = await this.adminModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      admins.map((admin) => {
        return { ...admin.toObject(), password: undefined };
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
          revenue: artist.revenue,
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
        return {
          _id: track._id,
          artist: artist.nickName,
          title: track.title,
          status: track.status,
        };
      }),
    );
  }

  async getAllAlbums() {
    const albums = await this.albumModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      albums.map(async (album) => {
        const artist = await this.artistModel.findOne({
          username: album.artist,
        });
        return {
          _id: album._id,
          title: album.title,
          tracks: album.tracks.length,
          artist: artist.nickName,
          coverArtUrl: album.coverArtUrl,
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
        const user = await this.userModel.findOne({ email: playlist.owner });
        return {
          _id: playlist._id,
          title: playlist.title,
          owner: playlist.owner,
          picture: user.picture,
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
      link: `${SELECTED.UrlServer}/file/${track.fileId}`,
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
    const user = await this.userModel.findOne({ email: playlist.owner });
    const tracks = await Promise.all(
      playlist.tracks.map((track) => {
        return this.getTrackById(track);
      }),
    );
    return { ...playlist.toObject(), picture: user.picture, tracks };
  }
  async getAdminById(id: string) {
    const admin = await this.adminModel.findById(id);
    return { ...admin.toObject() };
  }
  async paymentArtist(user: Admin, id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      return new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    if (artist.revenue < 30) {
      return new HttpException(
        'Revenue must be greater than or equal to 30$',
        HttpStatus.CONFLICT,
      );
    }
    const log = {
      level: SELECTED.Admin,
      username: user.username,
      log: `${user.username} paid artist ${artist.username} ${artist.revenue}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Paid', HttpStatus.ACCEPTED);
  }
  async deleteTrack(admin: Admin, id: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      return new HttpException('Track not found', HttpStatus.BAD_REQUEST);
    }
    await this.albumModel.updateMany(
      { tracks: { $in: [id] } },
      { $pull: { tracks: id } },
    );
    await this.playlistModel.updateMany(
      { tracks: { $in: [id] } },
      { $pull: { tracks: id } },
    );
    if (existsSync(track.path)) {
      unlinkSync(track.path);
    }
    await this.trackModel.deleteOne({ _id: id });
    const log = {
      level: SELECTED.Admin,
      username: admin.username,
      log: `${admin.username} has deleted track ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Deleted', HttpStatus.ACCEPTED);
  }
  async deleteAlbum(admin: Admin, id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException('Album not found', HttpStatus.BAD_REQUEST);
    }

    await this.albumModel.findByIdAndDelete(id);
    const log = {
      level: SELECTED.Admin,
      username: admin.username,
      log: `${admin.username} has deleted album ${id}`,
    };
    this.loggerService.createLogger(log);
    return { success: true };
  }
}
