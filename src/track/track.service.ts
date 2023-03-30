import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection, Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { Track, TrackDocument } from './model/track.model';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { CreateTrackDto } from './dto/create-track.dto';
import { Admin } from 'src/admin/model/admin.model';
import { LoggerService } from '../logger/logger.service';
import { env } from 'src/m/x/z/a/s/p/i/r/e/env';
import { MessagePlayDto } from './dto/message.play.dto';
import { NextMessageDto } from './dto/message.next.dto';
import { Album, AlbumDocument } from 'src/album/model/album.model';
import { MXZ } from 'src/m/x/z/a/s/p/i/r/e/defunc';

@Injectable()
export class TrackService {
  private fileModel: MongoGridFS;

  constructor(
    private readonly fileService: FileService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly loggerService: LoggerService,
  ) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

  async getFile(id: string) {
    const file = await this.fileService.findInfo(id);
    const fileStream = await this.fileService.readStream(id);
    return { file, fileStream };
  }

  upload(user: Artist, responses: any[], createTrack: CreateTrackDto) {
    const track = new this.trackModel({
      filename: responses[0].filename,
      uploaded: new Date(),
      fileId: responses[0].id,
      status: false,
      artist: user.username,
      ...createTrack,
      titleUnaccented: MXZ(createTrack.title),
    } as Track);
    track.save();
    this.loggerService.createLogger({
      level: env.Artist,
      username: user.username,
      log: `${user.username} has uploaded track ${track._id}`,
    });
    return track;
  }

  async updateInfoTrack(
    user: Artist,
    id: string,
    updateInfoTrack: UpdateInfoTrackDto,
  ) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.trackModel.updateOne({ _id: id }, {
        ...updateInfoTrack,
        titleUnaccented: MXZ(updateInfoTrack.title),
      } as Track);
      this.loggerService.createLogger({
        level: env.Artist,
        username: user.username,
        log: `${user.username} has updated the information of track ${id}`,
      });
      return new HttpException(`Updated track ${id}`, HttpStatus.ACCEPTED);
    } catch (err) {
      return new HttpException(
        `Update failed track ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStatusTrack(id: string, user: Admin) {
    const track = await this.trackModel.findById({
      _id: id,
    });
    if (!track) {
      return new HttpException(
        `This track does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!track.status) {
      await this.trackModel.findByIdAndUpdate({ _id: id }, { status: true });
      this.loggerService.createLogger({
        level: env.Admin,
        username: user.username,
        log: `${user.username} has updated the status of the track ${id} from ${
          track.status
        } to ${!track.status}`,
      });
      return new HttpException('Status update successful', HttpStatus.ACCEPTED);
    } else {
      await this.trackModel.findByIdAndUpdate({ _id: id }, { status: false });
      this.loggerService.createLogger({
        level: env.Admin,
        username: user.username,
        log: `${user.username} has updated the status of the track ${id} from ${
          track.status
        } to ${!track.status}`,
      });
      return new HttpException('Status update successful', HttpStatus.ACCEPTED);
    }
  }
  async getTrackById(id: string) {
    const track = await this.trackModel.findOne({
      _id: id,
      status: true,
      public: true,
    });
    const artist = await this.artistModel
      .findOne({ username: track.artist })
      .select('-password');
    return { ...track.toObject(), artist };
  }
  async playTrack(client: Socket, playMessage: MessagePlayDto) {
    if (playMessage.trackId) {
      const track = await this.trackModel.findById({
        _id: playMessage.trackId,
      });
      if (track) {
        if (!track.status) {
          client.send('This track is still waiting for approval');
          return;
        }
        if (!track.public) {
          client.send('This track is in private mode.');
          return;
        }
        await this.trackModel.updateOne(
          { _id: playMessage.trackId },
          { $inc: { listens: 1 } },
        );
        await this.artistModel.updateOne(
          { _id: track.artist },
          {
            $inc: { revenue: env.UnitPrice },
          },
        );
        const file = await this.getFile(track.fileId);
        if (file.fileStream) {
          let position = 0;
          file.fileStream.on('data', (data: Buffer) => {
            client.send({ data, position });
            position += data.length;
          });
        } else {
          client.send(new HttpException('Not found', HttpStatus.NOT_FOUND));
        }
      }
    }
  }
  async nextTrack(client: Socket, nextMessage: NextMessageDto) {
    let nextTrack: string = nextMessage.currentTrackId;
    const currentTrack = await this.trackModel.findById(
      nextMessage.currentTrackId,
    );
    if (currentTrack.album) {
      const album = await this.albumModel.findById(currentTrack.album);
      while (nextMessage.currentTrackId === nextTrack) {
        nextTrack =
          album.tracks[Math.floor(Math.random() * album.tracks.length)];
      }
    } else {
      const tracks = await this.trackModel.find({
        status: true,
        public: true,
      });
      while (nextMessage.currentTrackId === nextTrack) {
        const randomIndex = Math.floor(Math.random() * tracks.length);
        nextTrack = tracks[randomIndex]._id.toString();
      }
    }
    return this.playTrack(client, { trackId: nextTrack } as MessagePlayDto);
  }
}
