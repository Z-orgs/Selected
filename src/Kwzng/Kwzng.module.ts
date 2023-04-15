import { Module } from '@nestjs/common';
import { KwzngService } from './Kwzng.service';
import { KwzngController } from './Kwzng.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { FileModule } from '../file/file.module';
import { Admin, AdminSchema } from '../admin/model/admin.model';
import { Artist, ArtistSchema } from '../artist/model/artist.model';
import { Track, TrackSchema } from '../track/model/track.model';
import { AdminModule } from '../admin/admin.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { LoggerModule } from '../logger/logger.module';
import { SearchModule } from '../search/search.module';
import { HomeModule } from 'src/home/home.module';
import { SELECTED } from 'src/constants';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(SELECTED.MongoURI),
    UserModule,
    TrackModule,
    FileModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
    AdminModule,
    ArtistModule,
    AlbumModule,
    PlaylistModule,
    LoggerModule,
    SearchModule,
    HomeModule,
  ],
  controllers: [KwzngController],
  providers: [KwzngService],
  exports: [KwzngService],
})
export class KwzngModule {}
