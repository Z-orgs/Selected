import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './model/admin.model';
import { LoggerModule } from '../logger/logger.module';
import { Artist, ArtistSchema } from '../artist/model/artist.model';
import { User, UserSchema } from '../user/model/user.model';
import { Logger, LoggerSchema } from '../logger/model/logger.model';
import { Track, TrackSchema } from '../track/model/track.model';
import { Album, AlbumSchema } from '../album/model/album.model';
import { Playlist, PlaylistSchema } from '../playlist/model/playlist.model';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      {
        name: Artist.name,
        schema: ArtistSchema,
      },
      { name: User.name, schema: UserSchema },
      { name: Logger.name, schema: LoggerSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
    LoggerModule,
    CacheModule.register({
      ttl: 30 * 60 * 1000,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
