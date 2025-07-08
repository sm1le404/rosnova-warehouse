import {
  IsBoolean,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { IVehicleTank } from '../../vehicle/types';
import { CommonId } from '../../common/types/common-id.type';
import { OperationStatus, OperationType } from '../enums';
import { Trailer } from '../../vehicle/entities/trailer.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Dispenser } from '../../dispenser/entities/dispenser.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateOperationDto {
  @ApiProperty({
    required: false,
    description: 'Водитель',
    type: () => CommonId,
  })
  driver?: Pick<Driver, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Колонка',
    type: () => CommonId,
  })
  dispenser?: Pick<Dispenser, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Транспорт',
    type: () => CommonId,
  })
  vehicle?: Pick<Vehicle, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Прицеп',
    type: () => CommonId,
  })
  trailer?: Pick<Trailer, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Резервуар',
    type: () => CommonId,
  })
  tank: Pick<Tank, 'id'>;

  @ApiPropertyOptional({
    required: false,
    description: 'Резервуар, из которого переливают',
    type: () => CommonId,
  })
  @ValidateIf(
    (object: CreateOperationDto) => object.type === OperationType.MIXED,
  )
  @IsObject()
  @IsNotEmptyObject()
  sourceTank: Pick<Tank, 'id'>;

  @ApiProperty({
    required: true,
    type: () => CommonId,
    description: 'Топливо',
  })
  fuel: Pick<Fuel, 'id'>;

  @ApiProperty({
    required: true,
    type: () => CommonId,
    description: 'Владелец топлива',
  })
  fuelHolder: Pick<FuelHolder, 'id'>;

  @ApiProperty({
    required: true,
    type: () => CommonId,
    description: 'Завод',
  })
  refinery: Pick<Refinery, 'id'>;

  @ApiPropertyOptional({
    required: false,
    description: 'Назначение',
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  destination?: string;

  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Тип операции',
    enum: OperationType,
  })
  @IsEnum(OperationType, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  type: OperationType;

  @IsOptional()
  @IsEnum(OperationStatus, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  status?: OperationStatus;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  @MinLength(20, {
    message: 'Необходим комментарий длиной не менее 20 символов',
  })
  comment?: string;

  @ApiProperty({
    required: false,
    description: 'Объект, содержащий номер и состояние резервуара',
    type: () => IVehicleTank,
    isArray: true,
  })
  @IsOptional()
  vehicleState?: string;

  @ApiProperty({ required: false, description: 'Номер накладной' })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  numberTTN?: string;

  @ApiProperty({ required: false, description: 'Дата в накладной' })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  dateTTN?: number;

  startedAt?: number;

  finishedAt?: number;

  @ApiProperty({ required: true, description: 'Объём по документам' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  docVolume: number;

  @ApiProperty({ required: true, description: 'Вес по документам' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  docWeight: number;

  @ApiProperty({ required: false, description: 'Объём фактически' })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  factVolume?: number;

  @ApiProperty({ required: false, description: 'Вес фактически' })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  factWeight?: number;

  @ApiProperty({ required: true, description: 'Плотность по документам' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  docDensity: number;

  @ApiProperty({ required: true, description: 'Температура по документам' })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  docTemperature: number;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  dispenserError?: boolean;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  counterBefore?: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  counterAfter?: number;

  @ApiProperty({ required: false, description: 'Объем в резервуаре до' })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  volumeBefore?: number;

  @ApiProperty({ required: false, description: 'Объем в резервуаре после' })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  volumeAfter?: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  levelBefore: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.IsNumber'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('validation.Min'),
  })
  levelAfter: number;
}
