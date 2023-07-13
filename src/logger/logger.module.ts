import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger, LoggerSchema } from './model/logger.model';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logger.name, schema: LoggerSchema }]),
    NotificationModule,
  ],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
