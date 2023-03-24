import { Module } from '@nestjs/common';
import { GetMachineService } from './get-machine.service';
import { GetMachineController } from './get-machine.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from '../track/model/track.model';
import { Playlist, PlaylistSchema } from '../playlist/model/playlist.model';
import { Album, AlbumSchema } from '../album/model/album.model';
import { Artist, ArtistSchema } from '../artist/model/artist.model';
import { User, UserSchema } from '../user/model/user.model';
import { Logger, LoggerSchema } from '../logger/model/logger.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Logger.name, schema: LoggerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [GetMachineController],
  providers: [GetMachineService],
})
export class GetMachineModule {}
