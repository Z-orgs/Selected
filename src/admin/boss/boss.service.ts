import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '../../auth/role/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../user/model/user.model';
import { Model } from 'mongoose';
import { AwsClient } from 'google-auth-library';

@Injectable()
export class BossService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async updateRole(id: string, role: Role) {
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          $addToSet: {
            roles: role,
          },
        },
      );
      return new HttpException('OK', HttpStatus.OK);
    } catch (e) {
      console.log(e);
      return new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
