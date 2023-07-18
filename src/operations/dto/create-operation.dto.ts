import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Transform } from 'class-transformer';
import { IVehicleTank } from '../../vehicle/types';
import { CommonId } from '../../common/types/common-id.type';
import { OperationStatus, OperationType } from '../enums';

export class CreateOperationDto {
  @ApiProperty({
    required: true,
    description: 'Водитель',
    type: () => CommonId,
  })
  driver: Pick<Driver, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Транспорт',
    type: () => CommonId,
  })
  vehicle: Pick<Vehicle, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Резервуар',
    type: () => CommonId,
  })
  tank: Pick<Tank, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Топливо',
    type: () => CommonId,
  })
  fuel: Pick<Fuel, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Владелец топлива',
    type: () => CommonId,
  })
  fuelHolder: Pick<FuelHolder, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Завод',
    type: () => CommonId,
  })
  refinery: Pick<Refinery, 'id'>;

  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Тип операции',
    enum: OperationType,
  })
  @IsEnum(OperationType)
  type: OperationType;

  @ApiProperty({
    required: true,
    description: 'Статус операции',
    enum: OperationStatus,
  })
  @IsEnum(OperationStatus)
  status: OperationStatus;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и состояние резервуара',
    type: () => IVehicleTank,
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  vehicleState: string;

  @ApiProperty({ required: true, description: 'Номер накладной' })
  @IsPositive()
  numberTTN: number;

  @ApiProperty({ required: true, description: 'Объём по документам' })
  @IsNumber()
  @Min(0)
  docVolume: number;

  @ApiProperty({ required: true, description: 'Вес по документам' })
  @IsNumber()
  @Min(0)
  docWeight: number;

  @ApiProperty({ required: true, description: 'Плотность по документам' })
  @IsNumber()
  @Min(0)
  docDensity: number;

  @ApiProperty({ required: true, description: 'Температура по документам' })
  @IsNumber()
  docTemperature: number;

  @ApiProperty({ required: true, description: 'Фактический объём' })
  @IsNumber()
  @Min(0)
  factVolume: number;

  @ApiProperty({ required: true, description: 'Фактический вес' })
  @IsNumber()
  @Min(0)
  factWeight: number;

  @ApiProperty({ required: true, description: 'Фактическая плотность' })
  @IsNumber()
  @Min(0)
  factDensity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  counterBefore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  counterAfter?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  volumeBefore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  volumeAfter?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  factByTank: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  differenceWeight: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  levelBefore: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  levelAfter: number;
}
