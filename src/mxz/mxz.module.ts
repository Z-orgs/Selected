import { Module } from '@nestjs/common';
import { MxzService } from './mxz.service';
import { MxzController } from './mxz.controller';

@Module({
  controllers: [MxzController],
  providers: [MxzService],
  exports: [MxzService],
})
export class MxzModule {}
