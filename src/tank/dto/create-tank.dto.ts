import { IsBoolean, IsEnum, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Measurement } from '../../measurement/entities/measurement.entity';
import { ActiveFuelType } from '../enum';

export class CreateTankDto {
  @ApiProperty({ required: true, description: 'Тип топлива' })
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

  @ApiProperty({ required: true, description: 'Доступность' })
  @IsBoolean()
  isEnabled: boolean;

  @ApiProperty({ required: true, description: 'Замеры' })
  measurement: Pick<Measurement, 'id'>[];
}
