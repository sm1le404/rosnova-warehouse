import { Request } from 'express';
import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/entities/user.entity';
import { RoleType } from '../../user/enums';

@Injectable()
export class HasRole implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;

    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    if (!roles?.length) {
      return;
    }

    if (!user || !user.role) {
      return false;
    }

    return roles.includes(user.role);
  }
}
