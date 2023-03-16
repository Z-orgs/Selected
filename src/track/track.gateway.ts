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
} from '@nestjs/websockets/decorators';
import { MessagePlayDto } from './dto/message.play.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './model/track.model';

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
    this.logger.log(`${client.id}: ${messagePlay}`);
    if (messagePlay.trackId) {
      const file = await this.trackService.getFile(messagePlay.trackId);
      file.fileStream.on('data', (data: Buffer) => {
        client.send(data);
      });
    } else {
      this.io.emit(
        'play',
        new HttpException('Not found', HttpStatus.NOT_FOUND),
      );
    }
  }
}
