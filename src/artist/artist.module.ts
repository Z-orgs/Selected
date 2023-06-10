import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './model/artist.model';
import { FileModule } from 'src/file/file.module';
import { LoggerModule } from '../logger/logger.module';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { Album, AlbumSchema } from 'src/album/model/album.model';
import { User, UserSchema } from 'src/user/model/user.model';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from 'src/notification/notification.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
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
      ttl: 30 * 60 * 1000,
    }),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
