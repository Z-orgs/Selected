import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../admin/model/admin.model';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../artist/model/artist.model';
import { mxzASPIRE } from './mxz.aspire';
import { MxzService } from './mxz.service';

@Controller('mxz')
export class MxzController {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly mxzService: MxzService,
  ) {}

  @Get()
  // @UseGuards(JwtAdminAuthGuard)
  async initAdmin() {
    const admin = await this.adminModel.findOne({
      username: mxzASPIRE.Username,
    });
    if (!admin) {
      const initAdmin = new this.adminModel({
        username: mxzASPIRE.Username,
        password: mxzASPIRE.Password,
      });
      initAdmin.save();
    }
    const initArtist = new this.artistModel({
      username: mxzASPIRE.Username,
      password: mxzASPIRE.Password,
    });
    initArtist.save();
  }
}
