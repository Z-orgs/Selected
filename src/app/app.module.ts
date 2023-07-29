import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { FileModule } from '../file/file.module';
import { Track, TrackSchema } from '../track/model/track.model';
import { AdminModule } from '../admin/admin.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { LoggerModule } from '../logger/logger.module';
import { SearchModule } from '../search/search.module';
import { HomeModule } from 'src/home/home.module';
import { SELECTED } from 'src/constants';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(SELECTED.MongoURI),
    // UserModule,
    // TrackModule,
    // FileModule,
    // AdminModule,
    // ArtistModule,
    // AlbumModule,
    // PlaylistModule,
    // LoggerModule,
    // SearchModule,
    // HomeModule,
    // NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
