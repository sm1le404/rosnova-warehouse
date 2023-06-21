import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthLoginRequestDto } from '../dto/auth-login-request.dto';
import { EncryptionService } from './encryption.service';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly userService: UserService,
  ) {}

  async login(request: AuthLoginRequestDto): Promise<User> {
    const user = await this.userService.findUser({ login: request.login });
    if (!user) {
      throw new NotFoundException('Пользователь с таким логином не найден');
    }
    if (!user.isEnabled) {
      throw new BadRequestException(
        'Пользователь с таким логином заблокирован',
      );
    }

    const comparePass = await this.encryptionService.compare(
      request.password,
      user.password,
    );

    if (!comparePass) {
      throw new BadRequestException('Логин или пароль неверные');
    }

    return user;
  }

  async updateUserRefreshToken(
    token: string | null,
    id: number,
  ): Promise<User> {
    const hashedToken = await this.encryptionService.hash(token);
    return this.userService.updateUser(
      { id },
      {
        refreshToken: hashedToken,
      },
    );
  }
}
