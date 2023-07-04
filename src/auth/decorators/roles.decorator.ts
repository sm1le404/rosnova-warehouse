import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../user/enums';

export const SetRoles = (...roles: RoleType[]) => SetMetadata('roles', roles);
