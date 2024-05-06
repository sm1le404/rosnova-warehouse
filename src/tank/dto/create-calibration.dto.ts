import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonId } from '../../common/types/common-id.type';
import { Tank } from '../entities/tank.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCalibrationDto {
  @ApiProperty({
    required: false,
    description: 'Связный резервуар',
    type: () => CommonId,
  })
  tank?: Pick<Tank, 'id'>;

  @ApiProperty({ required: false, description: 'Объём', default: 0 })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  @IsOptional()
  volume?: number;

  @ApiProperty({ required: false, description: 'Уровень', default: 0 })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  @IsOptional()
  level?: number;
}
