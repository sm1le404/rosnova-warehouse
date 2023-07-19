import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '../enums';

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

  @ApiProperty({ required: false, description: 'Доступность', default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
