import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mxz, MxzDocument } from 'src/mxz/model/mxz.model';
import { mxzASPIRE } from 'src/mxz/mxz.aspire';
import { MxzService } from 'src/mxz/mxz.service';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateStatusTrack } from './dto/update-status-track.dto';
import { Admin, AdminDocument } from './model/admin.model';

@Injectable()
export class AdminService {
  private readonly level = 'admin';
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly mxzService: MxzService,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
  ) {}
  async createAdmin(user: Admin, createAdmin: CreateAdminDto) {
    const admin = await this.adminModel.findOne({
      username: createAdmin.username,
    });
    if (!admin) {
      new this.adminModel({ ...createAdmin } as Admin).save();
      this.mxzService.createMxz({
        level: this.level,
        username: user.username,
        log: `${user.username} created admin ${createAdmin.username}`,
      });
      return new HttpException('Created admin', HttpStatus.ACCEPTED);
    }
    return new HttpException('Admin already exist', HttpStatus.BAD_REQUEST);
  }
  async changePassword(user: Admin, changePassword: ChangePasswordDto) {
    if (user.username !== changePassword.username) {
      return new HttpException(
        `You cannot change someone else’s password`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (changePassword.newPassword !== changePassword.confirmNewPassword) {
      return new HttpException(
        `The new password and the password confirmation do not match`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const admin = await this.adminModel.findOne({
      username: changePassword.username,
      password: changePassword.password,
    });
    if (!admin) {
      return new HttpException(
        `The old password is incorrect`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.adminModel.findOneAndUpdate(
      { username: user.username },
      { password: changePassword.newPassword },
    );
    this.mxzService.createMxz({
      level: this.level,
      username: user.username,
      log: `${user.username} changed password.`,
    });
    return new HttpException(
      `Password changed successfully`,
      HttpStatus.ACCEPTED,
    );
  }
  async resetPassword(user: Admin, username: string) {
    const admin = await this.adminModel.findOne({ username });
    if (!admin) {
      return new HttpException(
        `This admin does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.adminModel.findOneAndUpdate(
      { username },
      { password: mxzASPIRE.DefaultPassword },
    );
    this.mxzService.createMxz({
      level: this.level,
      username: user.username,
      log: `${user.username} reset password for ${username}`,
    });
    return new HttpException(`Password reset successful`, HttpStatus.ACCEPTED);
  }
  async updateStatusTrack(user: Admin, updateStatusTrack: UpdateStatusTrack) {
    const track = await this.trackModel.findById({
      _id: updateStatusTrack.trackId,
    });
    if (!track) {
      return new HttpException(
        `This track does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.trackModel.findByIdAndUpdate(
      { _id: updateStatusTrack.trackId },
      { status: updateStatusTrack.status },
    );
    this.mxzService.createMxz({
      level: this.level,
      username: user.username,
      log: `${user.username} has updated the status of the track ${updateStatusTrack.trackId} from ${track.status} to ${updateStatusTrack.status}`,
    });
    return new HttpException('Status update successful', HttpStatus.ACCEPTED);
  }
}
