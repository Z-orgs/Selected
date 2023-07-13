import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger, LoggerDocument } from './model/logger.model';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<LoggerDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  createLogger(logger: CreateLoggerDto) {
    this.notificationGateway.sendNotification(logger);
    new this.loggerModel({
      level: logger.level,
      email: logger.email,
      time: new Date(),
      log: logger.log,
    }).save();
  }
  async getLoggerById(id: string) {
    return await this.loggerModel.findById(id);
  }
}
