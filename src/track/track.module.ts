import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackGateway } from './track.gateway';
import { FileModule } from 'src/file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './model/track.model';
import { TrackController } from './track.controller';
import { LoggerModule } from '../logger/logger.module';
import { Artist, ArtistSchema } from '../artist/model/artist.model';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from 'src/file/multer.service';
import { Album, AlbumSchema } from 'src/album/model/album.model';

@Module({
  imports: [
    FileModule,
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
    LoggerModule,
  ],
  providers: [TrackGateway, TrackService, GridFsMulterConfigService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
