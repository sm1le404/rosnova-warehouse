import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { TrailerType } from '../enums';
import { IVehicleTank } from '../types';

export class CreateTrailerDto {
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
  @IsNotEmpty()
  currentState?: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @IsNotEmpty()
  sectionVolumes: string;

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'Тип прицепа',
    enum: TrailerType,
    default: TrailerType.TRAILER,
  })
  @IsOptional()
  @IsEnum(TrailerType)
  type?: TrailerType;

  @ApiProperty({ required: false, description: 'Модель прицепа' })
  @IsOptional()
  @IsString()
  trailerModel?: string;
}
