import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class IVehicleTank {
  @ApiProperty({ required: true, description: 'Порядковый номер' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  index: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  density: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  temperature: number;

  @ApiProperty({ required: true, description: 'Объём' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  volume: number;

  @ApiProperty({ required: true, description: 'Максимальный объём' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  maxVolume: number;
}
