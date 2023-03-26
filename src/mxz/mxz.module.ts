import { Module } from '@nestjs/common';
import { MxzService } from './mxz.service';
import { MxzController } from './mxz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { env } from '../m/x/z/a/s/p/i/r/e/env';
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

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(env.MongoURI),
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
  ],
  controllers: [MxzController],
  providers: [MxzService],
  exports: [MxzService],
})
export class MxzModule {}
