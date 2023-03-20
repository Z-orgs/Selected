import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { FileModule } from '../file/file.module';
import { mxzASPIRE } from '../mxz/mxz.aspire';
import { Admin, AdminSchema } from 'src/admin/model/admin.model';
import { AppController } from './app.controller';
import { Artist, ArtistSchema } from 'src/artist/model/artist.model';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { AdminModule } from 'src/admin/admin.module';
import { ArtistModule } from 'src/artist/artist.module';
import { MxzModule } from 'src/mxz/mxz.module';
import { AlbumModule } from 'src/album/album.module';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(mxzASPIRE.MongoURI),
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
    MxzModule,
    AlbumModule,
    PlaylistModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
