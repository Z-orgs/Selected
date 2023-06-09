import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';
import { Admin, AdminDocument } from 'src/admin/model/admin.model';

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin') {}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ username });
    if (!admin) {
      throw new UnauthorizedException();
    }
    if (!(await compare(password, admin.password))) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}
