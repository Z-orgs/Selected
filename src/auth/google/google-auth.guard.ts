import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/model/user.model';
import { Model } from 'mongoose';
import { normalString, SELECTED } from 'src/constants';
import { Role } from '../role/role.enum';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
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
    const email = emails[0].value;
    if (email && !(await this.userModel.findOne({ email }))) {
      await new this.userModel({
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
      } as User).save();
      if (normalString(email) === normalString(SELECTED.EmailBoss)) {
        await this.userModel.updateOne(
          { email },
          {
            $addToSet: {
              roles: Role.Boss,
            },
          },
        );
      }
    }
    const user = (await this.userModel.findOne({ email })).toObject();
    const roles = user.roles;
    const payload = { email, roles };
    done(null, payload);
  }
}
