import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Fuel } from '../../fuel/entities/fuel.entity';
import { FuelHolder } from '../../fuel-holder/entities/fuel-holder.entity';
import { Refinery } from '../../refinery/entities/refinery.entity';
import { CommonId } from '../../common/types/common-id.type';

export class CreateTankDto {
  @ApiProperty({
    required: false,
    description: 'Вид топлива',
    type: () => CommonId,
  })
  fuel?: Pick<Fuel, 'id'>;

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

  @ApiProperty({ required: true, description: 'Общий объём' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalVolume: number;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({ required: false, description: 'Калибр по таблице' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  calibrationTable?: number;

  @ApiProperty({
    required: false,
    description: 'Критический баланс',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deathBalance?: number;

  @ApiProperty({ required: false, description: 'Температура', default: 0 })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiProperty({ required: false, description: 'Объём', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  volume?: number;

  @ApiProperty({ required: false, description: 'Вес', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ required: false, description: 'Плотность', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  density?: number;

  @ApiProperty({ required: false, description: 'Уровень', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  level?: number;
}
