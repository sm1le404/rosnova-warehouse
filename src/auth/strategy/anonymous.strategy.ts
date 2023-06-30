import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import auth from '../constants';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: auth.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  authenticate() {
    return this.success({});
  }
}
