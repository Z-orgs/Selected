import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger, LoggerDocument } from './model/logger.model';
import { CreateLoggerDto } from './dto/create-logger.dto';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<LoggerDocument>,
  ) {}

  createLogger(logger: CreateLoggerDto) {
    new this.loggerModel({
      level: logger.level,
      username: logger.username,
      time: new Date(),
      log: logger.log,
    }).save();
  }
  async getLoggerById(id: string) {
    return await this.loggerModel.findById(id);
  }
}
