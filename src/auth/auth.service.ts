import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  /**
   * If the user exists, return the user's information, otherwise create a new user and return the user's
   * information
   * @param req - The request object.
   * @returns The user's email, first name, last name, and picture.
   */
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google.';
    }
    return {
      user: req.user,
    };
  }
}
