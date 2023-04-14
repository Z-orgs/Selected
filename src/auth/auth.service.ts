import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Artist } from 'src/artist/model/artist.model';
import { Admin } from '../admin/model/admin.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/model/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  adminLogin(user: Admin) {
    const { username } = user;
    const payload = { username };
    return {
      admin_token: this.jwtService.sign(payload),
    };
  }
  artistLogin(user: Artist) {
    const { username } = user;
    const payload = { username };
    return {
      artist_token: this.jwtService.sign(payload),
    };
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google.';
    }
    return {
      user: req.user,
    };
  }
  async login({
    email,
    name,
    picture,
    given_name,
    family_name,
  }: {
    email: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
  }): Promise<any> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      const newUser = new this.userModel({
        email,
        name,
        picture,
        firstName: given_name,
        lastName: family_name,
      });
      await newUser.save();
      return newUser;
    } else {
      // console.log(user);
      return user;
    }
  }
}
