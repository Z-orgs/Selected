import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from '../logger/logger.service';
import { Track, TrackDocument } from '../track/model/track.model';
import { Album, AlbumDocument } from '../album/model/album.model';
import { Playlist, PlaylistDocument } from '../playlist/model/playlist.model';
import { Logger, LoggerDocument } from '../logger/model/logger.model';
import { User, UserDocument } from '../user/model/user.model';
import { SELECTED } from 'src/constants';
import { existsSync, unlinkSync } from 'fs';
import { ReqUser } from 'src/global';

@Injectable()
export class AdminService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<LoggerDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getAllAdmins() {
    const admins = await this.userModel
      .find({ roles: { $in: ['admin'] } })
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      admins.map((admin) => {
        return { ...admin.toObject(), password: undefined };
      }),
    );
  }

  async getAllArtists() {
    const artists = await this.userModel
      .find({ roles: { $in: ['artist'] } })
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      artists.map((artist) => {
        return {
          _id: artist._id,
          profileImage: artist.profileImage,
          nickName: artist.nickName,
          email: artist.email,
          revenue: artist.revenue,
        };
      }),
    );
  }

  async getAllTracks() {
    const tracks = await this.trackModel.find().sort({ createdAt: 'desc' });
    return await Promise.all(
      tracks.map(async (track) => {
        const artist = await this.userModel.findOne({
          email: track.author,
          roles: { $in: ['artist'] },
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
        const artist = await this.userModel.findOne({
          email: album.author,
          roles: { $in: 'artist' },
        });
        return {
          _id: album._id,
          title: album.title,
          tracks: album.tracks ? album.tracks.length : 0,
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
    if (!track) {
      return null;
    }
    return {
      ...track.toObject(),
      link: `${SELECTED.UrlServer}/file/${track.fileId}`,
    };
  }

  async getAlbumById(id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const tracks = await Promise.all(
      album.tracks.map((track) => {
        return this.getTrackById(track);
      }),
    );
    return { ...album.toObject(), tracks };
  }
  async getPlaylistById(id: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) {
      return new HttpException('Playlist not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userModel.findOne({ email: playlist.owner });
    const tracks = await Promise.all(
      playlist.tracks.map((track) => {
        return this.getTrackById(track);
      }),
    );
    return { ...playlist.toObject(), picture: user.picture, tracks };
  }
  async paymentArtist(user: ReqUser, id: string) {
    const artist = await this.userModel.findById(id);
    if (!artist) {
      return new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    if (artist.revenue < 30) {
      return new HttpException(
        'Revenue must be greater than or equal to 30$',
        HttpStatus.CONFLICT,
      );
    }
    await this.userModel.updateOne({ _id: id }, { revenue: 0 });
    const log = {
      level: SELECTED.Admin,
      email: user.email,
      log: `${user.email} paid artist ${artist.email} ${artist.revenue}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Paid', HttpStatus.ACCEPTED);
  }
  async deleteTrack(admin: ReqUser, id: string) {
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
      email: admin.email,
      log: `${admin.email} has deleted track ${id}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Deleted', HttpStatus.ACCEPTED);
  }
  async deleteAlbum(admin: ReqUser, id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      return new HttpException('Album not found', HttpStatus.BAD_REQUEST);
    }

    await this.albumModel.findByIdAndDelete(id);
    const log = {
      level: SELECTED.Admin,
      email: admin.email,
      log: `${admin.email} has deleted album ${id}`,
    };
    this.loggerService.createLogger(log);
    return { success: true };
  }
}
