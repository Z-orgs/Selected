import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './model/playlist.model';
import { LoggerModule } from '../logger/logger.module';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheResetMiddleware } from 'src/reset.cache.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
    LoggerModule,
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheResetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
