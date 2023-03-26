import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { TrackService } from './track.service';
import { Logger } from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagePlayDto } from './dto/message.play.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './model/track.model';
import { MessageInfoDto } from './dto/message.info.dto';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { env } from '../m/x/z/a/s/p/i/r/e/env';

@WebSocketGateway({ namespace: 'track', cors: true })
export class TrackGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TrackGateway.name);

  constructor(
    private readonly trackService: TrackService,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
  ) {}

  @WebSocketServer() io: Namespace;

  afterInit(server: any) {
    this.logger.log('Websocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('play')
  async playTrack(
    @ConnectedSocket() client: Socket,
    @MessageBody() messagePlay: MessagePlayDto,
  ) {
    if (messagePlay.trackId) {
      this.logger.log(`${client.id} is getting track ${messagePlay.trackId}`);
      const track = await this.trackModel.findById({
        _id: messagePlay.trackId,
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
          { _id: messagePlay.trackId },
          { $inc: { listens: 1 } },
        );
        await this.artistModel.updateOne(
          { _id: track.artist },
          {
            $inc: { revenue: env.UnitPrice },
          },
        );
        const file = await this.trackService.getFile(track.fileId);
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

  @SubscribeMessage('info')
  async infoTrack(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageInfo: MessageInfoDto,
  ) {
    if (messageInfo.trackId) {
      this.logger.log(`${client.id} is getting info ${messageInfo.trackId}`);
      const track = await this.trackModel.findById({
        _id: messageInfo.trackId,
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
        client.send(JSON.stringify(track));
      } else {
        client.send(new HttpException('Not found', HttpStatus.NOT_FOUND));
      }
    }
  }
}
