import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TrackService } from './track.service';
import { FileModule } from 'src/file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './model/track.model';
import { TrackController } from './track.controller';
import { LoggerModule } from '../logger/logger.module';
import { Album, AlbumSchema } from 'src/album/model/album.model';
import { Playlist, PlaylistSchema } from 'src/playlist/model/playlist.model';
import { User, UserSchema } from 'src/user/model/user.model';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheResetMiddleware } from 'src/reset.cache.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    FileModule,
    AuthModule,
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema },
    ]),
    LoggerModule,
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheResetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
