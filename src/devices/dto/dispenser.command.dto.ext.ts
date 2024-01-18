import { DispenserCommand } from '../enums/dispenser.enum';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { DispenserCommandDto } from './dispenser.command.dto';

export class DispenserCommandDtoExt extends OmitType(DispenserCommandDto, [
  'addressId',
  'comId',
]) {
  @ApiProperty({
    type: () => DispenserCommand,
    enum: DispenserCommand,
    description: `${Object.keys(DispenserCommand).join(', ')}`,
  })
  @IsEnum(DispenserCommand)
  command: DispenserCommand;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  dispenserId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  dispenserNumber: number;

  @ApiProperty({ required: false })
  data?: Buffer;
}
