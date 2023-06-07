import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './model/album.model';
import { FileModule } from 'src/file/file.module';
import { LoggerModule } from '../logger/logger.module';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { Artist, ArtistSchema } from 'src/artist/model/artist.model';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
      {
        name: Track.name,
        schema: TrackSchema,
      },
      {
        name: Artist.name,
        schema: ArtistSchema,
      },
    ]),
    FileModule,
    LoggerModule,
    CacheModule.register({
      ttl: 8 * 60 * 60 * 1000,
    }),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
