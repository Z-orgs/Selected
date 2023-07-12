import { AuthGuard } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/model/user.model';
import { Model } from 'mongoose';
import { SELECTED } from 'src/constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      clientID: SELECTED.ClientId,
      clientSecret: SELECTED.ClientSecret,
      callbackURL: SELECTED.CallbackURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      jwt: '',
    };
    const { email, firstName, lastName, picture } = user;
    const payload = { email, firstName, lastName, picture };
    user.jwt = this.jwtService.sign(payload);
    const result = await this.userModel.findOne({ email: email });
    if (!result) {
      const newUser = new this.userModel({
        email,
        firstName,
        lastName,
        picture,
        following: [],
        playList: [],
      });
      await newUser.save();
    }
    done(null, user);
  }
}
