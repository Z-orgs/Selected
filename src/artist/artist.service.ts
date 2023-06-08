import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin } from 'src/admin/model/admin.model';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from './model/artist.model';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ChangePasswordDto } from 'src/admin/dto/change-password.dto';
import { LoggerService } from '../logger/logger.service';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { SocialLink } from './dto/social.links';
import { SELECTED, normalString } from 'src/constants';
import { User, UserDocument } from 'src/user/model/user.model';
import { compare, genSalt, hash } from 'bcrypt';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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
      nickNameUnaccented: normalString(createArtist.nickName),
    } as Artist);
    artist.salt = await genSalt();
    artist.password = await hash(artist.password, artist.salt);
    artist.save();
    const log = {
      level: SELECTED.Admin,
      username: user.username,
      log: `${user.username} has created artist ${artist.username}`,
    };
    this.loggerService.createLogger(log);
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
      nickNameUnaccented: normalString(updateArtist.nickName),
    } as Artist);
    const log = {
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has updated information`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Updated', HttpStatus.ACCEPTED);
  }

  async changePassword(user: Artist, changePassword: ChangePasswordDto) {
    const artist = await this.artistModel.findOne({ username: user.username });
    if (!artist) {
      return new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    if (!(await compare(changePassword.password, artist.password))) {
      return new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }
    if (changePassword.newPassword !== changePassword.confirmNewPassword) {
      return new HttpException(
        'New password and password confirmation do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.artistModel.updateOne({ username: user.username }, {
      password: await hash(changePassword.newPassword, artist.salt),
    } as Artist);
    const log = {
      level: SELECTED.Artist,
      username: user.username,
      log: `${user.username} has changed password`,
    };
    this.loggerService.createLogger(log);
    return new HttpException(
      'Password changed successfully',
      HttpStatus.ACCEPTED,
    );
  }
  async getArtistById(user: User, id: string) {
    const artist = await this.artistModel.findById(id).select('-password');
    if (!artist) {
      return new HttpException('Artist not found.', HttpStatus.NOT_FOUND);
    }
    const albums = await this.albumModel
      .find({ artist: artist.username, isPublic: true })
      .sort({ createdAt: 'desc' });
    const tracks = await this.trackModel
      .find({
        artist: artist.username,
        status: true,
        isPublic: true,
      })
      .sort({ createdAt: 'desc' });
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();
    return {
      artist,
      albums,
      tracks,
      followed: currentUser.following.indexOf(id) !== -1,
    };
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
          coverArtUrl: album.coverArtUrl,
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
      link: `${SELECTED.UrlServer}/file/${track.fileId}`,
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
  async resetPassword(user: Admin, id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      return new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    await this.artistModel.findByIdAndUpdate(id, {
      password: await hash(SELECTED.DefaultPassword, artist.salt),
    });
    const log = {
      level: SELECTED.Admin,
      username: user.username,
      log: `${user.username} has reset password for artist ${artist.username}`,
    };
    this.loggerService.createLogger(log);
    return new HttpException('Reset', HttpStatus.ACCEPTED);
  }
}
