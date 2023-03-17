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

@WebSocketGateway({ namespace: 'track', cors: true })
export class TrackGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TrackGateway.name);
  constructor(
    private readonly trackService: TrackService,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
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
        client.send(JSON.stringify(track));
      } else {
        client.send(new HttpException('Not found', HttpStatus.NOT_FOUND));
      }
    }
  }
}
