import { DispenserCommand } from '../enums/dispenser.enum';
import { IDispenserCommand } from '../interfaces/dispenser.command.interface';
import { ApiProperty } from '@nestjs/swagger';

export class DispenserCommandDto implements IDispenserCommand {
  @ApiProperty({
    type: () => DispenserCommand,
    enum: DispenserCommand,
    description: `${Object.keys(DispenserCommand).join(', ')}`,
  })
  command: DispenserCommand;

  @ApiProperty()
  addressId: number;

  @ApiProperty()
  data?: Buffer;
}
