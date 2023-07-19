import { DispenserCommand } from '../enums/dispenser.enum';

export interface IDispenserCommand {
  command: DispenserCommand;
  addressId: number;
  data?: Array<any>;
}
