import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { SupplyType } from '../enums';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';

export class CreateSupplyDto {
  @ApiProperty({ required: true, description: 'Имя водителя' })
  @IsNotEmpty()
  @IsString()
  driverName: string;

  @ApiProperty({ required: true, description: 'Тип поставки' })
  @IsEnum(SupplyType)
  type: SupplyType;

  @ApiProperty({ required: true, description: 'Номер накладной' })
  @IsPositive()
  numberTTN: number;

  @ApiProperty({ required: true, description: 'Объём по документам' })
  @IsPositive()
  docVolume: number;

  @ApiProperty({ required: true, description: 'Вес по документам' })
  @IsPositive()
  docWeight: number;

  @ApiProperty({ required: true, description: 'Плотность по документам' })
  @IsPositive()
  docDensity: number;

  @ApiProperty({ required: true, description: 'Температура по документам' })
  @IsPositive()
  docTemperature: number;

  @ApiProperty({ required: true, description: 'Фактический объём' })
  @IsPositive()
  factVolume: number;

  @ApiProperty({ required: true, description: 'Фактический вес' })
  @IsPositive()
  factWeight: number;

  @ApiProperty({ required: true, description: 'Фактическая плотность' })
  @IsPositive()
  factDensity: number;

  @ApiProperty({ required: true, description: 'Фактически в резервуаре' })
  @IsPositive()
  factByTank: number;

  @ApiProperty({
    required: true,
    description: 'Разница документарного и фактического веса',
  })
  @IsPositive()
  differenceWeight: number;

  @ApiProperty({ required: true, description: 'Объём до' })
  @IsPositive()
  volumeBefore: number;

  @ApiProperty({ required: true, description: 'Объём после' })
  @IsPositive()
  volumeAfter: number;

  @ApiProperty({ required: true, description: 'Уровень до' })
  @IsPositive()
  levelBefore: number;

  @ApiProperty({ required: true, description: 'Уровень после' })
  @IsPositive()
  levelAfter: number;

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
    description: 'Топливо',
    type: () => PickType(Fuel, ['id']),
  })
  fuel: Pick<Fuel, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Владелец топлива',
    type: () => PickType(FuelHolder, ['id']),
  })
  fuelHolder: Pick<FuelHolder, 'id'>;

  @ApiProperty({
    required: true,
    description: 'Завод',
    type: () => PickType(Refinery, ['id']),
  })
  refinery: Pick<Refinery, 'id'>;

  shift: Pick<Shift, 'id'>;
}
