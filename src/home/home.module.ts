import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from 'src/album/model/album.model';
import { Playlist, PlaylistSchema } from 'src/playlist/model/playlist.model';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { User, UserSchema } from 'src/user/model/user.model';
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
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
