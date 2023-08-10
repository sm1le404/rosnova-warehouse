import { DispenserCommand } from '../enums/dispenser.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

export class DispenserCommandDto {
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

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(255)
  comId: number;

  @ApiProperty({ required: false })
  data?: Buffer;
}
