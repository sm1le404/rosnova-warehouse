import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { CommonId } from '../../common/types/common-id.type';
import { TankHistory } from '../entities/tank-history.entity';
import { Transform } from 'class-transformer';
import { Calibration } from '../entities/calibration.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTankDto {
  @ApiProperty({
    required: false,
    description: 'Вид топлива',
    type: () => CommonId,
  })
  fuel?: Pick<Fuel, 'id'>;

  @Transform(({ value }) => value.map((item) => ({ id: item.toString() })))
  tankHistory?: Pick<TankHistory, 'id'>[];

  @Transform(({ value }) => value.map((item) => ({ id: item.toString() })))
  calibration?: Pick<Calibration, 'id'>[];

  @ApiProperty({
    required: false,
    description: 'Владелец топлива',
    type: () => CommonId,
  })
  fuelHolder?: Pick<FuelHolder, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Завод',
    type: () => CommonId,
  })
  refinery?: Pick<Refinery, 'id'>;

  @ApiProperty({ required: true, description: '№ РГС' })
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  sortIndex: number;

  @ApiProperty({ required: false, description: 'Адрес COM порта' })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  comId?: number;

  @ApiProperty({ required: false, description: 'Адрес на COM порте' })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage('validation.IsInt'),
  })
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  addressId?: number;

  @ApiProperty({ required: true, description: 'Общий объём' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  totalVolume: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  isEnabled?: boolean;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  isBlocked?: boolean;

  @ApiProperty({
    required: false,
    description: 'Критический остаток',
    default: 0,
  })
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
  deathBalance?: number;
}
