import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackGateway } from './track.gateway';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [FileModule],
  providers: [TrackGateway, TrackService],
})
export class TrackModule {}
