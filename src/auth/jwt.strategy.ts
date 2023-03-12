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
   * It takes the payload from the JWT and returns an object with the same properties
   * @param {any} payload - The payload that was sent to the API.
   * @returns The user's email, first name, last name, and picture.
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
