import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthLoginRequestDto } from '../dto/auth-login-request.dto';
import { EncryptionService } from './encryption.service';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { ShiftService } from '../../shift/services/shift.service';
import { ICurrentUser } from '../interface/current-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly userService: UserService,
    private readonly shiftService: ShiftService,
  ) {}

  async login(request: AuthLoginRequestDto): Promise<User> {
    const user = await this.userService.findOne({
      where: { login: request.login },
      select: { password: true, isEnabled: true, id: true, role: true },
    });

    let lastShift = await this.shiftService.getLastShift(user.id);

    if (!lastShift) {
      await this.shiftService.create({
        startedAt: Math.floor(Date.now() / 1000),
        user,
      });

      lastShift = await this.shiftService.getLastShift(user.id);
    }

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

    (user as ICurrentUser).lastShift = lastShift;

    return user;
  }

  async updateUserRefreshToken(
    token: string | null,
    id: number,
  ): Promise<User> {
    const hashedToken = await this.encryptionService.hash(token);
    return this.userService.update(
      { where: { id } },
      {
        refreshToken: hashedToken,
      },
    );
  }
}
