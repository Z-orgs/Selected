import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google.';
    }
    const { email, firstName, lastName, picture } = req.user;
    const result = await this.userModel.findOne({ email: email });
    if (!result) {
      const newUser = new this.userModel({
        email,
        firstName,
        lastName,
        picture,
      });
      newUser.save();
    }
    const payload = { email, firstName, lastName, picture };
    return {
      jwt: this.jwtService.sign(payload),
      user: req.user,
    };
  }
}
