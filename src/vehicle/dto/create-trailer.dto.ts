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
import { Driver } from '../../driver/entities/driver.entity';

export class CreateTrailerDto {
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Водитель',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? { id: +value } : null))
  driver?: Pick<Driver, 'id'>;

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
