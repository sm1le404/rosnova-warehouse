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
import { IVehicleTank } from '../types';

export class CreateVehicleDto {
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

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и состояние резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  vehicleState: string;

  @ApiProperty({
    required: true,
    description: 'Объект, содержащий номер и объём резервуара',
    type: () => PickType(IVehicleTank, ['index', 'volume']),
    isArray: true,
  })
  @Transform(({ value }) => JSON.stringify(value))
  @IsNotEmpty()
  @IsString()
  tanksVolume: string;

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
