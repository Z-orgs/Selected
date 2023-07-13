import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './model/album.model';
import { FileModule } from 'src/file/file.module';
import { LoggerModule } from '../logger/logger.module';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheResetMiddleware } from 'src/reset.cache.middleware';
import { User, UserSchema } from '../user/model/user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FileModule,
    LoggerModule,
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheResetMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
