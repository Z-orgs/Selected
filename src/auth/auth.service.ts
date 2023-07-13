import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  ) {}
  async googleLogin(req: Request, res: Response) {
    if (!req.user) {
      return 'No user from google.';
    }
    res.cookie(
      'accessToken',
      (req.user as User & { accessToken: string }).accessToken,
    );
    res.cookie(
      'refreshToken',
      (req.user as User & { refreshToken: string }).refreshToken,
    );
    res.redirect(SELECTED.FE_URL);
  }

  async logout(
    user: User & { accessToken: string } & { refreshToken: string },
    all: boolean,
  ) {
    if (!all) {
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
          refreshTokens: user.refreshToken,
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
          $set: {
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
