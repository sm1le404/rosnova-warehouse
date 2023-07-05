import { IsBoolean, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ActiveFuelType } from '../enum';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';

export class CreateTankDto {
  @ApiProperty({
    required: true,
    description: 'Тип топлива',
    type: ActiveFuelType,
  })
  @IsEnum(ActiveFuelType)
  activeFuel: ActiveFuelType;

  @ApiProperty({ required: true, description: 'Порядок сортировки' })
  @IsPositive()
  sortIndex: number;

  @ApiProperty({ required: true, description: 'Калибр по таблице' })
  @IsPositive()
  calibrationTable: number;

  @ApiProperty({ required: true, description: 'Общий объём' })
  @IsPositive()
  totalVolume: number;

  @ApiProperty({ required: true, description: 'Критический баланс' })
  @IsPositive()
  deathBalance: number;

  @ApiProperty({ required: true, description: 'Температура' })
  @IsPositive()
  temperature: number;

  @ApiProperty({ required: true, description: 'Объём' })
  @IsPositive()
  volume: number;

  @ApiProperty({ required: true, description: 'Вес' })
  @IsPositive()
  weight: number;

  @ApiProperty({ required: true, description: 'Плотность' })
  @IsPositive()
  density: number;

  @ApiProperty({ required: true, description: 'Уровень' })
  @IsPositive()
  level: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'Вид топлива',
    type: () => PickType(Fuel, ['id']),
  })
  fuel?: Pick<Fuel, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Владелец топлива',
    type: () => PickType(FuelHolder, ['id']),
  })
  fuelHolder?: Pick<FuelHolder, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Завод',
    type: () => PickType(Refinery, ['id']),
  })
  refinery?: Pick<Refinery, 'id'>;
}
