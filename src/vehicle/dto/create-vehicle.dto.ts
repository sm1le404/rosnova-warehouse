import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { VehicleType } from '../enums';
import { Driver } from '../../driver/entities/driver.entity';
import { Trailer } from '../entities/trailer.entity';
import { IVehicleTank } from '../types';
import { CommonId } from '../../common/types/common-id.type';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateVehicleDto {
  @ApiProperty({
    required: true,
    description: 'Тип ТС',
    enum: VehicleType,
  })
  @IsEnum(VehicleType, {
    message: i18nValidationMessage('validation.IsEnum'),
  })
  type: VehicleType;

  @ApiProperty({
    type: () => CommonId,
    required: false,
    description: 'Водитель',
  })
  @IsOptional()
  driver?: Pick<Driver, 'id'>;

  @ApiProperty({ type: () => CommonId, required: false, description: 'Прицеп' })
  @IsOptional()
  trailer?: Pick<Trailer, 'id'>;

  @ApiProperty({
    required: false,
    description: 'Объект, содержащий номер и состояние резервуаров',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @IsOptional()
  currentState?: string;

  @ApiProperty({
    required: false,
    description: 'Объект, содержащий номер и калибр резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @IsOptional()
  sectionVolumes?: string;

  @ApiProperty({ required: true, description: 'Модель ТС' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  carModel: string;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IsNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.IsString'),
  })
  regNumber: string;

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean({
    message: i18nValidationMessage('validation.IsBoolean'),
  })
  @IsOptional()
  isEnabled?: boolean;
}
