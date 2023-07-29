import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from '../logger/logger.service';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { SocialLink } from '../user/model/social.links';
import { SELECTED, normalString } from 'src/constants';
import { User, UserDocument } from 'src/user/model/user.model';
import { UpdateArtistDto } from './update.artist.dto';
import { Role } from '../auth/role/role.enum';
import { Request } from 'express';
import { ReqUser } from 'src/global';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  async updateArtist(
    user: ReqUser,
    updateArtist: UpdateArtistDto,
    imageId: string,
  ) {
    const artist = await this.userModel.findOne({ email: user.email });
    await this.userModel.updateOne({ email: user.email }, {
      ...updateArtist,
      socialLinks: JSON.parse(updateArtist.socialLinks) as SocialLink[],
      profileImage: imageId ? imageId : artist.profileImage,
      nickNameUnaccented: normalString(updateArtist.nickName),
    } as User);
    const log = {
      level: SELECTED.Artist,
      email: user.email,
      log: `${user.email} has updated information`,
    };
    this.loggerService.createLogger(log);
    return {
      ...(await this.userModel.findOne({ email: user.email })).toObject(),
    };
  }

  async getArtistById(user: ReqUser, id: string) {
    const artist = await this.userModel.findById(id);
    if (!artist) {
      return new HttpException('Artist not found.', HttpStatus.NOT_FOUND);
    }
    const albums = await this.albumModel
      .find({ artist: artist.email, isPublic: true })
      .sort({ createdAt: 'desc' });
    const tracks = await this.trackModel
      .find({
        artist: artist.email,
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
  async getAllAlbums(user: ReqUser) {
    const albums = await this.albumModel
      .find({ artist: user.email })
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      albums.map((album) => {
        return {
          _id: album._id,
          title: album.title,
          tracks: album.tracks ? album.tracks.length : 0,
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
  async getAllTracks(user: ReqUser) {
    const tracks = await this.trackModel
      .find({ artist: user.email })
      .sort({ createdAt: 'desc' });
    return await Promise.all(
      tracks.map(async (track) => {
        const artist = await this.userModel.findOne({
          email: track.author,
        });
        return { _id: track._id, artist: artist.nickName, title: track.title };
      }),
    );
  }

  async makeArtist(req: Request, email: string) {
    try {
      await this.userModel.updateOne(
        { email },
        {
          $set: {
            roles: Role.Artist,
          },
        },
      );
      this.loggerService.createLogger({
        email: req.user.email,
        level: Role.Admin,
        log: `${req.user.email} created artist ${email}`,
      });
      return new HttpException('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
