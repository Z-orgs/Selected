import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../admin/model/admin.model';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { env } from '../m/x/z/a/s/p/i/r/e/env';

@Controller('mxz')
export class MxzController {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
  ) {}
  //test function
  @Get()
  async initAdmin() {
    const admin = await this.adminModel.findOne({
      username: env.Username,
    });
    if (!admin) {
      const initAdmin = new this.adminModel({
        username: env.Username,
        password: env.Password,
      });
      initAdmin.save();
    }
    const initArtist = new this.artistModel({
      username: env.Username,
      password: env.Password,
    });
    initArtist.save();
  }
}
