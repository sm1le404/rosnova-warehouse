import { Shift } from '../../shift/entities/shift.entity';
import { User } from '../../user/entities/user.entity';

export interface ICurrentUser extends User {
  lastShift: Shift;
}
