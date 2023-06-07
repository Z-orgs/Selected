import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MulterModule.register({
      dest: './data/filesElected',
    }),
    CacheModule.register({
      ttl: 8 * 60 * 60 * 1000,
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
