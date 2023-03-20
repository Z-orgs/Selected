import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FileModule } from 'src/file/file.module';
import { GridFsMulterConfigService } from 'src/file/multer.service';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { TrackModule } from 'src/track/track.module';
import { MxzModule } from 'src/mxz/mxz.module';

@Module({
  imports: [
    FileModule,
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    TrackModule,
    MxzModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
