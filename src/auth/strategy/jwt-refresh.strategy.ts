import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';
import { TokenPayload } from '../interface';
import { EncryptionService } from '../services/encryption.service';
import { UserService } from '../../user/services/user.service';
import auth from '../constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly encryptionService: EncryptionService,
    protected readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: auth.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const token = request.cookies?.Refresh;

    const { refreshToken, ...user } = await this.userService.findOne({
      where: { id: payload.id },
    });

    if (!user || !token || !refreshToken) {
      return false;
    }

    const checkResult = await this.encryptionService.compare(
      token,
      refreshToken,
    );

    if (!checkResult) {
      return false;
    }

    return user;
  }
}
