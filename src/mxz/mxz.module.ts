import { Module } from '@nestjs/common';
import { MxzService } from './mxz.service';
import { MxzController } from './mxz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mxz, MxzSchema } from './model/mxz.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Mxz.name, schema: MxzSchema }])],
  controllers: [MxzController],
  providers: [MxzService],
  exports: [MxzService],
})
export class MxzModule {}
