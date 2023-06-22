import { IsEnum, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '../enums';

export class CreateOutcomeDto {
  @ApiProperty({ required: true, description: 'Тип топлива' })
  @IsEnum(StatusType)
  status: StatusType;

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

  @ApiProperty({ required: true, description: 'Счётчик до' })
  @IsPositive()
  counterBefore: number;

  @ApiProperty({ required: true, description: 'Счётчик после' })
  @IsPositive()
  counterAfter: number;

  @ApiProperty({ required: true, description: 'Объём до' })
  @IsPositive()
  volumeBefore: number;

  @ApiProperty({ required: true, description: 'Объём после' })
  @IsPositive()
  volumeAfter: number;
}
