import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { Admin } from '../admin/model/admin.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/model/user.model';
import { Request, Response } from 'express';
import { SELECTED } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
  ) {}
  adminLogin(user: Admin) {
    const { username } = user;
    const payload = { username };
    return {
      admin_token: this.jwtService.sign(payload),
    };
  }
  async artistLogin(user: Artist) {
    const { username } = user;
    const payload = { username };
    const artist = await this.artistModel
      .findOne({ username })
      .select('-password');
    return {
      ...artist.toObject(),
      artist_token: this.jwtService.sign(payload),
    };
  }
  async googleLogin(req: Request, res: Response) {
    if (!req.user) {
      return 'No user from google.';
    }
    res.cookie('accessToken', (req.user as User & { jwt: string }).jwt);
    res.redirect(SELECTED.FE_URL);
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
