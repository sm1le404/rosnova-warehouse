import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';
import { TokenPayload } from '../interface';
import { UserService } from '../../user/services/user.service';
import auth from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: auth.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne({
      where: {
        id: payload.id,
      },
    });
  }
}
