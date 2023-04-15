import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { SELECTED } from 'src/constants';

@Injectable()
export class JwtArtistAuthGuard extends AuthGuard('jwtartist') {}

@Injectable()
export class JwtArtistStrategy extends PassportStrategy(Strategy, 'jwtartist') {
  /**
   * The constructor function is called when the class is instantiated
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: SELECTED.ClientSecret,
    });
  }

  async validate(payload: any) {
    return { username: payload.username };
  }
}
