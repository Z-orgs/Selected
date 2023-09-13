import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/model/user.model';
import { SELECTED } from '../constants';
import { ReqUser } from 'src/global';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

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
    const userDb = await this.userModel.findOne({ email: user.email });
    if (
      userDb.refreshTokens.findIndex(
        (refreshTokenDb) => refreshTokenDb === refreshToken,
      ) === -1
    ) {
      return new HttpException(
        'Refresh token does not exist',
        HttpStatus.NOT_FOUND,
      );
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

  async googleRedirect(req: Request, res: Response) {
    try {
      if (!req.user) {
        return 'No user from google.';
      }
      const existUser = await this.userModel.findOne({ email: req.user.email });
      const code = crypto.randomBytes(32).toString('hex').slice(0, 16);
      existUser.code = `${code}${SELECTED.FE_KEY}`;
      await existUser.save();
      res.redirect(`${SELECTED.FE_URL}/auth?code=${code}`);
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(code: string) {
    const user = await this.userModel.findOne({
      code: `${code}`,
    });
    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        roles: user.roles,
      },
      { secret: SELECTED.Secret },
    );
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        roles: user.roles,
      },
      { secret: SELECTED.RefreshSecret },
    );
    user.refreshTokens.push(refreshToken);
    user.code = '';
    await user.save();
    return { accessToken, refreshToken };
  }
}
