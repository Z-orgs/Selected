import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../admin/model/admin.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  adminLogin(user: Admin) {
    const { username } = user as Admin;
    const payload = { username };
    return {
      admin_token: this.jwtService.sign(payload),
    };
  }
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
