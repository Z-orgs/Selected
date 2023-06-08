import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../admin/model/admin.model';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { SELECTED } from 'src/constants';
import { genSalt, hash } from 'bcrypt';
import { existsSync } from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { JwtAdminAuthGuard } from 'src/auth/admin/jwtadmin-auth.guard';

@Controller()
export class AppController {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
  ) {}
  //test function
  @Get()
  async initAdmin() {
    const admin = await this.adminModel.findOne({
      username: SELECTED.Admin,
    });
    if (!admin) {
      const newAdmin = new this.adminModel({
        username: SELECTED.Admin,
      } as Admin);

      newAdmin.salt = await genSalt();

      newAdmin.password = await hash(SELECTED.Password, newAdmin.salt);
      await newAdmin.save();
    }
  }
  @Get('reload')
  @UseGuards(JwtAdminAuthGuard)
  async reload() {
    const tracks = await this.trackModel.find();
    tracks.forEach(async (track) => {
      if (existsSync(track.path)) {
        await this.trackModel.updateOne(
          { _id: track._id },
          {
            duration: await getAudioDurationInSeconds(track.path),
          },
        );
      }
    });
    return 'a';
  }
}
