import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { mxzASPIRE } from 'src/mxz/mxz.aspire';

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwtadmin') {}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwtadmin') {
  /**
   * The constructor function is called when the class is instantiated
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: mxzASPIRE.ClientSecret,
    });
  }
  async validate(payload: any) {
    return { username: payload.username };
  }
}
