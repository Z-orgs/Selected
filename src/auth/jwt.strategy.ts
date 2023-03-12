import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ENVConstants } from 'src/env.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor function is called when the class is instantiated
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: ENVConstants.ClientSecret,
    });
  }

  /**
   * The validate function is called by the JWT strategy when a user tries to authenticate. The payload
   * is the decoded JWT token. The validate function returns the user object that will be attached to the
   * request object
   * @param {any} payload - The decoded JWT payload.
   * @returns The userId, username, and role of the user.
   */
  async validate(payload: any) {
    return {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      picture: payload.picture,
    };
  }
}
