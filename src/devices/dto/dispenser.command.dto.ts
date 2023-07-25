import { DispenserCommand } from '../enums/dispenser.enum';
import { IDispenserCommand } from '../interfaces/dispenser.command.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

export class DispenserCommandDto implements IDispenserCommand {
  @ApiProperty({
    type: () => DispenserCommand,
    enum: DispenserCommand,
    description: `${Object.keys(DispenserCommand).join(', ')}`,
  })
  @IsEnum(DispenserCommand)
  command: DispenserCommand;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(255)
  addressId: number;

  @ApiProperty({ required: false })
  data?: Buffer;
}
