import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../interface';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class TokensService {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  decode(token: string): TokenPayload {
    const decode = this.jwtService.decode(token);
    const payload = {};

    Object.assign(payload, decode);

    return payload as TokenPayload;
  }

  getJwtAccessToken(payload: TokenPayload): Token {
    const expiredIn = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${expiredIn}s`,
    });

    return {
      token,
      expiredIn: expiredIn * 1000,
    };
  }

  getJwtRefreshToken(payload: TokenPayload): Token {
    const expiredIn = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    return {
      token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${expiredIn}s`,
      }),
      expiredIn: expiredIn * 1000,
    };
  }
}
