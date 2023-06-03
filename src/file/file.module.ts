import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { File, FileSchema } from './model/file.model';

@Module({
  imports: [
    MulterModule.register({
      dest: './data/filesElected',
    }),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
