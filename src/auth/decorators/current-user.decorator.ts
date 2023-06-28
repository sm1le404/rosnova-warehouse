import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { ICurrentUser } from '../interface/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, context: ExecutionContext): ICurrentUser => {
    const request = context.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }

    request.user.lastShift = request.user.shift.sort((a, b) => b.id - a.id)[0];

    return request.user;
  },
);
