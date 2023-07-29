import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/model/user.model';
import { SELECTED } from '../constants';
import { ReqUser } from 'src/global';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async logout(user: ReqUser, refreshToken?: string) {
    if (!refreshToken) {
      await this.userModel.updateOne(
        { email: user.email },
        { refreshTokens: [] },
      );
      return;
    }
    await this.userModel.updateOne(
      {
        email: user.email,
      },
      {
        $pull: {
          refreshTokens: refreshToken,
        },
      },
    );
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: SELECTED.RefreshSecret,
    });
    if (
      payload.email &&
      payload.roles &&
      (await this.userModel.findOne({ email: payload.email }))
    ) {
      const accessToken = this.jwtService.sign(
        {
          email: payload.email,
          roles: payload.roles,
        },
        { secret: SELECTED.Secret },
      );
      const newRefreshToken = this.jwtService.sign(
        {
          email: payload.email,
          roles: payload.roles,
        },
        { secret: SELECTED.RefreshSecret },
      );
      await this.userModel.updateOne(
        { email: payload.email },
        {
          $addToSet: {
            refreshTokens: newRefreshToken,
          },
        },
      );
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    }
  }
}
