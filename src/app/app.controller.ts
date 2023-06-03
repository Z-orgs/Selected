import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../admin/model/admin.model';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { SELECTED } from 'src/constants';
import { genSalt, hash } from 'bcrypt';

@Controller()
export class AppController {
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
      const newAdmin = new this.adminModel({
        username: SELECTED.Admin,
      } as Admin);

      newAdmin.salt = await genSalt();

      newAdmin.password = await hash(SELECTED.Password, newAdmin.salt);
      await newAdmin.save();
    }
  }
}
