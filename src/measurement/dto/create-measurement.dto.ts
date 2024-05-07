import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Shift } from '../../shift/entities/shift.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { CommonId } from '../../common/types/common-id.type';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMeasurementDto {
  @ApiProperty({
    type: () => CommonId,
    description: 'id смена',
  })
  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    type: () => CommonId,
    description: 'id резервуар',
  })
  tank: Pick<Tank, 'id'>;

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

  @ApiProperty({ required: true, description: 'Вес' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  weight: number;

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
  temperature: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  level: number;
}
