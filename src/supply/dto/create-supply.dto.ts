import { IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupplyType } from '../enums';

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

  @ApiProperty({ required: true, description: 'Разница' })
  @IsPositive()
  difference: number;

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
}
