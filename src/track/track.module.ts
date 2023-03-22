import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackGateway } from './track.gateway';
import { FileModule } from 'src/file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './model/track.model';
import { TrackController } from './track.controller';
import { MxzModule } from 'src/mxz/mxz.module';

@Module({
  imports: [
    FileModule,
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MxzModule,
  ],
  providers: [TrackGateway, TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
