import { DispenserCommand } from '../enums/dispenser.enum';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { DispenserCommandDto } from './dispenser.command.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DispenserCommandDtoExt extends OmitType(DispenserCommandDto, [
  'addressId',
  'comId',
]) {
  @ApiProperty({
    type: () => DispenserCommand,
    enum: DispenserCommand,
    description: `${Object.keys(DispenserCommand).join(', ')}`,
  })
  @IsEnum(DispenserCommand, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  command: DispenserCommand;

  @ApiProperty({ required: false })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @IsOptional()
  dispenserId: number;

  @ApiProperty({ required: false })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @IsOptional()
  dispenserNumber: number;

  @ApiProperty({ required: false })
  data?: Buffer;
}
