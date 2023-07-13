import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway],
})
export class NotificationModule {}
