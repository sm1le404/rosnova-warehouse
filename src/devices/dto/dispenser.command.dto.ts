import { DispenserCommand } from '../enums/dispenser.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DispenserCommandDto {
  @ApiProperty({
    type: () => DispenserCommand,
    enum: DispenserCommand,
    description: `${Object.keys(DispenserCommand).join(', ')}`,
  })
  @IsEnum(DispenserCommand, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  command: DispenserCommand;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  @Max(255, {
    message: i18nValidationMessage('validation.Max'),
  })
  addressId: number;

  @ApiProperty()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  @Max(255, {
    message: i18nValidationMessage('validation.Max'),
  })
  comId: number;

  @ApiProperty({ required: false })
  data?: Buffer;
}
