import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './model/artist.model';
import { MxzModule } from 'src/mxz/mxz.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MxzModule,
    FileModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
