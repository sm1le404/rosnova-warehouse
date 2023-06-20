import { Request } from 'express';
import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Permission } from '../../auth-partner-rbac/enums/permission.enum';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class HasPermission implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (user.isSuperAdministrator) {
      return true;
    }

    const permissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions?.length) {
      return;
    }

    if (!user || !user.role) {
      return false;
    }

    return user.role.permissions.some((permission) =>
      permissions.includes(permission),
    );
  }
}
