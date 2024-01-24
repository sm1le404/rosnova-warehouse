import { RoleType } from '../../user/enums';

export const isOperatorLastShift = (
  role: RoleType,
  currentShift: number,
  lastShift: number,
): boolean =>
  role === RoleType.ADMIN ||
  (role === RoleType.OPERATOR && currentShift === lastShift);
