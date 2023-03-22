import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mxz, MxzSchema } from 'src/mxz/model/mxz.model';
import { Admin, AdminSchema } from './model/admin.model';
import { Track, TrackSchema } from 'src/track/model/track.model';
import { MxzModule } from 'src/mxz/mxz.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MxzModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
