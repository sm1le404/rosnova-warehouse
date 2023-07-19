import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { TrailerType } from '../enums';
import { Transform } from 'class-transformer';
import { IVehicleTank } from '../types';

export class CreateTrailerDto {
  @ApiProperty({
    required: true,
    description: 'Тип прицепа',
    enum: TrailerType,
  })
  @IsEnum(TrailerType)
  type: TrailerType;

  @ApiProperty({ required: true, description: 'Модель прицепа' })
  @IsNotEmpty()
  @IsString()
  carModel: string;

  @ApiProperty({ required: true, description: 'Регистрационный номер прицепа' })
  @IsNotEmpty()
  @IsString()
  regNumber: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Объект, содержащий номер и состояние резервуаров',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  currentState?: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  tanksCalibration: string;

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
