import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { User, UserSchema } from '../user/model/user.model';

@Module({
  imports: [
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
