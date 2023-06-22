import { IsBoolean, IsEnum, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarModelType, VehicleType } from '../enums';

export class CreateVehicleDto {
  @ApiProperty({ required: true, description: 'Тип ТС' })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ required: true, description: 'Модель ТС' })
  @IsEnum(CarModelType)
  carModel: CarModelType;

  @ApiProperty({ required: true, description: 'Регистрационный номер ТС' })
  regNumber: string;

  @ApiProperty({ required: true, description: 'Объём резервуара' })
  tanksVolume: number;

  @ApiProperty({ required: true, description: 'Калибр резервуара' })
  tanksCalibration: number;

  @ApiProperty({ required: true, description: 'Доступность' })
  @IsBoolean()
  isEnabled: boolean;
}
