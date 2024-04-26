import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
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
  @IsNotEmpty()
  @IsString()
  destination?: string;

  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Тип операции',
    enum: OperationType,
  })
  @IsEnum(OperationType)
  type: OperationType;

  @IsOptional()
  @IsEnum(OperationStatus)
  status?: OperationStatus;

  @IsOptional()
  @IsString()
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
  @IsString()
  numberTTN?: string;

  @ApiProperty({ required: false, description: 'Дата в накладной' })
  @IsOptional()
  @IsNumber()
  dateTTN?: number;

  startedAt?: number;

  finishedAt?: number;

  @ApiProperty({ required: true, description: 'Объём по документам' })
  @IsNumber()
  @Min(0)
  docVolume: number;

  @ApiProperty({ required: true, description: 'Вес по документам' })
  @IsNumber()
  @Min(0)
  docWeight: number;

  @ApiProperty({ required: false, description: 'Объём фактически' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  factVolume?: number;

  @ApiProperty({ required: false, description: 'Вес фактически' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  factWeight?: number;

  @ApiProperty({ required: true, description: 'Плотность по документам' })
  @IsNumber()
  @Min(0)
  docDensity: number;

  @ApiProperty({ required: true, description: 'Температура по документам' })
  @IsNumber()
  docTemperature: number;

  @IsOptional()
  @IsBoolean()
  dispenserError?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  counterBefore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  counterAfter?: number;

  @ApiProperty({ required: false, description: 'Объем в резервуаре до' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  volumeBefore?: number;

  @ApiProperty({ required: false, description: 'Объем в резервуаре после' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  volumeAfter?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  levelBefore: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  levelAfter: number;
}
