import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from 'src/file/file.module';
import { LoggerModule } from '../logger/logger.module';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { Album, AlbumSchema } from 'src/album/model/album.model';
import { User, UserSchema } from 'src/user/model/user.model';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheResetMiddleware } from 'src/reset.cache.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      {
        name: Album.name,
        schema: AlbumSchema,
      },
      { name: User.name, schema: UserSchema },
    ]),
    FileModule,
    LoggerModule,
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheResetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
