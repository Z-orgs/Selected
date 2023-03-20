import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMxzDto } from './dto/create-mxz.dto';
import { Mxz, MxzDocument } from './model/mxz.model';

@Injectable()
export class MxzService {
  constructor(
    @InjectModel(Mxz.name) private readonly mxzModel: Model<MxzDocument>,
  ) {}
  createMxz(createMxz: CreateMxzDto) {
    new this.mxzModel({
      level: createMxz.level,
      username: createMxz.username,
      time: new Date(),
      log: createMxz.log,
    }).save();
  }
}
