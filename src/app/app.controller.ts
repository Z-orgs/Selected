import { Controller, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/model/admin.model';
import { JwtAdminAuthGuard } from 'src/auth/admin/jwtadmin-auth.guard';
import { mxzASPIRE } from 'src/mxz/mxz.aspire';

@Controller()
export class AppController {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
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
  }
}
