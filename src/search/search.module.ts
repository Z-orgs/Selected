import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from '../track/model/track.model';
import { Album, AlbumSchema } from '../album/model/album.model';
import { Playlist, PlaylistSchema } from '../playlist/model/playlist.model';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheResetMiddleware } from 'src/reset.cache.middleware';
import { User, UserSchema } from '../user/model/user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheResetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
