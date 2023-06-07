import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from '../artist/model/artist.model';
import { Track, TrackSchema } from '../track/model/track.model';
import { Album, AlbumSchema } from '../album/model/album.model';
import { Playlist, PlaylistSchema } from '../playlist/model/playlist.model';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Track.name, schema: TrackSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
    CacheModule.register({
      ttl: 24 * 60 * 60 * 1000,
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
