import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { VehicleType } from '../enums';
import { Transform } from 'class-transformer';
import { Driver } from '../../driver/entities/driver.entity';
import { Trailer } from '../entities/trailer.entity';
import { IVehicleTank } from '../types';
import { CommonId } from '../../common/types/common-id.type';

export class CreateVehicleDto {
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
  @Transform(({ value }) => JSON.stringify(value))
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentState?: string;

  @ApiProperty({
    required: false,
    description: 'Объект, содержащий номер и калибр резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sectionVolumes?: string;

  @ApiProperty({
    required: true,
    description: 'Тип ТС',
    enum: VehicleType,
  })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ required: true, description: 'Модель ТС' })
  @IsNotEmpty()
  @IsString()
  carModel: string;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  @IsNotEmpty()
  @IsString()
  regNumber: string;

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
