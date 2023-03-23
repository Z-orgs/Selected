import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin } from 'src/admin/model/admin.model';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Artist, ArtistDocument } from './model/artist.model';
import { MxzService } from 'src/mxz/mxz.service';
import { mxzASPIRE } from 'src/mxz/mxz.aspire';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ChangePasswordDto } from 'src/admin/dto/change-password.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly mxzService: MxzService,
  ) {}
  async createArtist(user: Admin, createArtist: CreateArtistDto) {
    if (
      !(await this.artistModel.findOne({ username: createArtist.username }))
    ) {
      return new HttpException(
        `Username already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist = new this.artistModel({
      ...createArtist,
      followers: 0,
    } as Artist);
    artist.save();
    this.mxzService.createMxz({
      level: mxzASPIRE.Admin,
      username: user.username,
      log: `${user.username} has created artist ${artist._id}`,
    });
    return new HttpException('Created artist.', HttpStatus.ACCEPTED);
  }
  async updateArtist(
    user: Artist,
    updateArtist: UpdateArtistDto,
    imageId: Types.ObjectId,
  ) {
    const artist = await this.artistModel.findOne({ username: user.username });
    await this.artistModel.updateOne({ username: user.username }, {
      ...updateArtist,
      profileImage: imageId ? imageId : artist.profileImage,
    } as Artist);
    this.mxzService.createMxz({
      level: mxzASPIRE.Artist,
      username: user.username,
      log: `${user.username} has updated information`,
    });
    return new HttpException('Updated', HttpStatus.ACCEPTED);
  }
  async changePassword(user: Artist, changePassword: ChangePasswordDto) {
    const artist = await this.artistModel.findOne({ username: user.username });
    if (artist.password !== changePassword.password) {
      return new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }
    if (changePassword.newPassword !== changePassword.confirmNewPassword) {
      return new HttpException(
        'New password and password confirmation do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.artistModel.updateOne({ username: user.username }, {
      password: changePassword.newPassword,
    } as Artist);
    this.mxzService.createMxz({
      level: mxzASPIRE.Artist,
      username: user.username,
      log: `${user.username} has changed password`,
    });
    return new HttpException(
      'Password changed successfully',
      HttpStatus.ACCEPTED,
    );
  }
}
