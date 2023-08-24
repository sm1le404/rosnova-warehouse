import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';
import { TokenPayload } from '../interface';
import { UserService } from '../../user/services/user.service';
import auth from '../constants';
import { ShiftService } from '../../shift/services/shift.service';
import { ICurrentUser } from '../interface/current-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly userService: UserService,
    protected readonly shiftService: ShiftService,
  ) {
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
    const user = await this.userService.findOne({
      where: {
        id: payload.id,
      },
    });

    const lastShift = await this.shiftService.getLastShift();
    (user as ICurrentUser).lastShift = lastShift;

    return user;
  }
}
