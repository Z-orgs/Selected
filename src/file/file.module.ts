import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { Track, TrackSchema } from 'src/track/model/track.model';

@Module({
  imports: [
    MulterModule.register({
      dest: './data/filesElected',
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
