import { IsEnum, IsPositive } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { OutcomeType } from '../enums';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Tank } from '../../tank/entities/tank.entity';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Shift } from '../../shift/entities/shift.entity';

export class CreateOutcomeDto {
  @ApiProperty({
    required: true,
    description: 'Водитель',
    type: () => PickType(Driver, ['id']),
  })
  driver: Pick<Driver, 'id'>;

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

  @ApiProperty({
    required: true,
    description: 'Состояние отпуска',
    enum: OutcomeType,
  })
  @IsEnum(OutcomeType)
  type: OutcomeType;

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

  @IsPositive()
  counterBefore: number;

  @IsPositive()
  counterAfter: number;

  @IsPositive()
  volumeBefore: number;

  @IsPositive()
  volumeAfter: number;
}
