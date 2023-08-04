import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { CommonId } from '../../common/types/common-id.type';
import { TankHistory } from '../entities/tank-history.entity';
import { Transform } from 'class-transformer';
import { Calibration } from '../entities/calibration.entity';

export class CreateTankDto {
  @ApiProperty({
    required: false,
    description: 'Вид топлива',
    type: () => CommonId,
  })
  fuel?: Pick<Fuel, 'id'>;

  @ApiProperty({
    required: false,
    description: 'История состояния резервуара',
    isArray: true,
    type: () => CommonId,
  })
  @Transform(({ value }) => value.map((item) => ({ id: item.toString() })))
  tankHistory?: Pick<TankHistory, 'id'>[];

  @ApiProperty({
    required: false,
    description: 'Калибровочная таблица',
    isArray: true,
    type: () => CommonId,
  })
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

  @ApiProperty({ required: true, description: 'Порядок сортировки' })
  @IsInt()
  @Min(0)
  sortIndex: number;

  @ApiProperty({ required: false, description: 'Адрес на COM порте' })
  @IsOptional()
  @IsInt()
  @Min(0)
  addressId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalVolume: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiProperty({
    required: false,
    description: 'Критический баланс',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deathBalance?: number;
}
