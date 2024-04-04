import { DispenserCommand } from '../enums/dispenser.enum';
import { FindOptionsWhere } from 'typeorm';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';

export class DispenserCommandInterface {
  dispenser: FindOptionsWhere<Dispenser> | FindOptionsWhere<Dispenser>[];

  command: DispenserCommand;

  data?: Buffer | Array<any>;
}
