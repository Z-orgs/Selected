import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from 'src/album/model/album.model';
import { Artist, ArtistSchema } from 'src/artist/model/artist.model';
import { Playlist, PlaylistSchema } from 'src/playlist/model/playlist.model';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { ArtistModule } from 'src/artist/artist.module';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';
import { User, UserSchema } from 'src/user/model/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ArtistModule,
    PlaylistModule,
    AlbumModule,
    TrackModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
