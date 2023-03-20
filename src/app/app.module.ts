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

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(mxzASPIRE.MongoURI),
    UserModule,
    TrackModule,
    FileModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
  ],
  controllers: [AppController],
})
export class AppModule {}
