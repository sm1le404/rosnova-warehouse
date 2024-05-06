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
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTrailerDto {
  @ApiProperty({ required: true, description: 'Регистрационный номер прицепа' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  regNumber: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Объект, содержащий номер и состояние резервуаров',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  currentState?: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и калибр резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  sectionVolumes: string;

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  @IsOptional()
  isEnabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'Тип прицепа',
    enum: TrailerType,
    default: TrailerType.TRAILER,
  })
  @IsOptional()
  @IsEnum(TrailerType, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  type?: TrailerType;

  @ApiProperty({ required: false, description: 'Модель прицепа' })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  trailerModel?: string;
}
