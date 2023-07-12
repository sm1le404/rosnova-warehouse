import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { SupplyType } from '../enums';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { IVehicleTank } from '../../vehicle/types';
import { Transform } from 'class-transformer';

export class CreateSupplyDto {
  @ApiProperty({
    required: true,
    description: 'Транспорт',
    type: () => PickType(Vehicle, ['id']),
  })
  vehicle: Pick<Vehicle, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Резервуар',
    type: () => PickType(Tank, ['id']),
  })
  tank: Pick<Tank, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Водитель',
    type: () => PickType(Driver, ['id']),
  })
  driver: Pick<Driver, 'id'>;

  fuel: Pick<Fuel, 'id'>;

  fuelHolder: Pick<FuelHolder, 'id'>;

  refinery: Pick<Refinery, 'id'>;

  shift: Pick<Shift, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Тип поставки',
    enum: SupplyType,
  })
  @IsEnum(SupplyType)
  type: SupplyType;

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

  @ApiProperty({ required: true, description: 'Фактически в резервуаре' })
  @IsNumber()
  @Min(0)
  factByTank: number;

  @ApiProperty({
    required: true,
    description: 'Разница документарного и фактического веса',
  })
  @IsNumber()
  differenceWeight: number;

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
  levelBefore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  levelAfter?: number;
}
