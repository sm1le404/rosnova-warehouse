import { RoleType } from '../../user/enums';

export const isRoot = (role: RoleType): boolean => role === RoleType.ROOT;
