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
import { NextMessageDto } from './dto/message.next.dto';

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
    @MessageBody() playMessage: MessagePlayDto,
  ) {
    return this.trackService.playTrack(client, playMessage);
  }
  @SubscribeMessage('next')
  async nextTrack(
    @ConnectedSocket() client: Socket,
    @MessageBody() nextMessage: NextMessageDto,
  ) {
    return this.trackService.nextTrack(client, nextMessage);
  }
}
