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

@WebSocketGateway({ namespace: 'track', cors: true })
export class TrackGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TrackGateway.name);
  constructor(private readonly trackService: TrackService) {}

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
      // messagePlay.loop = messagePlay.loop || 'no';
      // messagePlay.speed = messagePlay.speed || 1;
      const file = this.trackService.getFile(messagePlay.trackId);
      client.emit('data', (await file).file);
      (await file).fileStream.on('data', (chunk) => {
        client.emit('fileChunk', chunk);
      });
    } else {
      this.io.emit(
        'play',
        new HttpException('Not found', HttpStatus.NOT_FOUND),
      );
    }
  }
}
