import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../admin/model/admin.model';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { SELECTED } from 'src/constants';

@Controller('Kwzng')
export class KwzngController {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
  ) {}
  //test function
  @Get()
  async initAdmin() {
    const admin = await this.adminModel.findOne({
      username: SELECTED.Admin,
    });
    if (!admin) {
      const initAdmin = new this.adminModel({
        username: SELECTED.Admin,
        password: SELECTED.Password,
      });
      initAdmin.save();
    }
    const artist = await this.artistModel.findOne({
      username: SELECTED.Artist,
    });
    if (!artist) {
      const initArtist = new this.artistModel({
        username: SELECTED.Artist,
        password: SELECTED.Password,
      });
      initArtist.save();
    }
  }
}
