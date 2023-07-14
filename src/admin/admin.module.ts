import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../logger/logger.module';
import { User, UserSchema } from '../user/model/user.model';
import { Logger, LoggerSchema } from '../logger/model/logger.model';
import { Track, TrackSchema } from '../track/model/track.model';
import { Album, AlbumSchema } from '../album/model/album.model';
import { Playlist, PlaylistSchema } from '../playlist/model/playlist.model';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheResetMiddleware } from 'src/reset.cache.middleware';
import { AuthModule } from '../auth/auth.module';
import { BossController } from './boss/boss.controller';
import { BossService } from './boss/boss.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Logger.name, schema: LoggerSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
    LoggerModule,
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  controllers: [AdminController, BossController],
  providers: [AdminService, BossService],
  exports: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheResetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
