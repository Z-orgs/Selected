import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { FileModule } from 'src/file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './model/track.model';
import { TrackController } from './track.controller';
import { LoggerModule } from '../logger/logger.module';
import { Artist, ArtistSchema } from '../artist/model/artist.model';
import { Album, AlbumSchema } from 'src/album/model/album.model';
import { Playlist, PlaylistSchema } from 'src/playlist/model/playlist.model';
import { User, UserSchema } from 'src/user/model/user.model';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from 'src/notification/notification.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    FileModule,
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema },
    ]),
    LoggerModule,
    CacheModule.register({
      ttl: 8 * 60 * 60 * 1000,
    }),
  ],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
