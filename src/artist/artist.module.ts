import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './model/artist.model';
import { FileModule } from 'src/file/file.module';
import { LoggerModule } from '../logger/logger.module';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { Album, AlbumSchema } from 'src/album/model/album.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Track.name, schema: TrackSchema },
      {
        name: Album.name,
        schema: AlbumSchema,
      },
    ]),
    FileModule,
    LoggerModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
