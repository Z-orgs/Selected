import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { Image, ImageSchema } from './model/image.model';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [FileController],
  providers: [GridFsMulterConfigService, FileService],
  exports: [FileService],
})
export class FileModule {}
