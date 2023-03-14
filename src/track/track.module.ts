import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackGateway } from './track.gateway';

@Module({
  providers: [TrackGateway, TrackService],
})
export class TrackModule {}
