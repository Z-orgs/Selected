import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Logger } from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({ namespace: 'notification', cors: true })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);
  @WebSocketServer() io: Namespace;
  constructor(private readonly notificationService: NotificationService) {}

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
  sendNotification(notification: Notification) {
    const sockets = this.io.sockets;
    sockets.forEach((socket) => {
      socket.emit('notification', notification);
    });
  }
}
